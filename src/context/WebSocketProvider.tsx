"use client";
import { iBid, iSupabasePayload } from "@/lib/types";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import supabase from "@/lib/db";
import { REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";
import { toast } from "sonner";
import { mockItems } from "@/lib/dummy-data";

interface WebSocketContextProps {
	placeBid: (itemId: string, amount: number, userId: string) => Promise<void>;
	highestBids: Record<string, iBid>;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [highestBids, setHighestBids] = useState<Record<string, iBid>>({});

	// Fetch bids from the database on initial load
	useEffect(() => {
		const fetchBids = async () => {
			try {
				// first populate highest bids with prices from mockItems
				const MockBidsMap = mockItems.reduce<Record<string, iBid>>((acc, bid) => {
					if (!acc[bid.id] || bid.price > acc[bid.id].amount) {
						acc[bid.id] = {
							itemId: bid.id,
							amount: bid.price,
							userId: "system",
							timestamp: new Date().toISOString(),
						};
					}
					return acc;
				}, {});

				console.log("mockBids", MockBidsMap);
				setHighestBids(MockBidsMap);

				const { data, error } = await supabase
					.from("bids")
					.select("*")
					.order("timestamp", { ascending: false });

				if (error) {
					console.error("Error fetching bids:", error);
					return;
				}

				const highestBidsMap = (data as iBid[]).reduce<Record<string, iBid>>((acc, bid) => {
					if (!acc[bid.itemId] || bid.amount > acc[bid.itemId].amount) {
						acc[bid.itemId] = bid;
					}
					return acc;
				}, {});

				console.log("db bids", highestBidsMap);
				setHighestBids(highestBidsMap);
			} catch (err) {
				console.error("Unexpected error fetching bids:", err);
			}
		};

		fetchBids();
	}, []);

	// Subscribe to real-time updates for the "bids" table
	useEffect(() => {
		const subscription = supabase
			.channel("realtime.public.bids")
			.on<iSupabasePayload>(
				REALTIME_LISTEN_TYPES.POSTGRES_CHANGES as REALTIME_LISTEN_TYPES.SYSTEM,
				{ event: "*", schema: "public", table: "bids" },
				(payload) => {
					if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
						const bid = payload.new as iBid;

						// monitor change in highest bids
						// check if the user of the current highest bid for the bided item is still the highest after the new bid
						console.log("highest bid user", highestBids[bid.itemId]?.userId);
						console.log("highest bid amount", highestBids[bid.itemId]?.amount);
						console.log("bid user", bid?.userId);
						if (
							highestBids[bid.itemId]?.userId !== bid.userId &&
							bid.amount > highestBids[bid.itemId]?.amount
						) {
							toast(`You just lost item to a new bid: ${bid.itemId}`);
						}

						setHighestBids((prev) => ({
							...prev,
							[bid.itemId]: bid,
						}));
					}
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(subscription);
		};
	}, []);

	const placeBid = useCallback(async (itemId: string, amount: number, userId: string) => {
		try {
			const { error } = await supabase.from("bids").insert([
				{
					itemId,
					amount,
					userId,
					timestamp: new Date().toISOString(),
				},
			]);

			if (error) {
				console.error("Error placing bid:", error);
			}
		} catch (err) {
			console.error("Unexpected error placing bid:", err);
		}
	}, []);

	return (
		<WebSocketContext.Provider value={{ placeBid, highestBids }}>
			{children}
		</WebSocketContext.Provider>
	);
};

export const useWebSocket = () => {
	const context = useContext(WebSocketContext);
	if (!context) {
		throw new Error("useWebSocket must be used within a WebSocketProvider");
	}
	return context;
};
