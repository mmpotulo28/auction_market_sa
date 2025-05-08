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

	// Initialize highest bids with mock data and fetch from the database
	useEffect(() => {
		const initializeBids = async () => {
			try {
				const mockBidsMap = mockItems.reduce<Record<string, iBid>>((acc, item) => {
					acc[item.id] = {
						itemId: item.id,
						amount: item.price,
						userId: "system",
						timestamp: new Date().toISOString(),
					};
					return acc;
				}, {});
				setHighestBids(mockBidsMap);

				const { data, error } = await supabase
					.from("bids")
					.select("*")
					.order("timestamp", { ascending: false });

				if (error) {
					console.error("Error fetching bids:", error);
					return;
				}

				const dbBidsMap = (data as iBid[]).reduce<Record<string, iBid>>((acc, bid) => {
					if (!acc[bid.itemId] || bid.amount > acc[bid.itemId].amount) {
						acc[bid.itemId] = bid;
					}
					return acc;
				}, {});

				setHighestBids((prev) => ({ ...prev, ...dbBidsMap }));
			} catch (err) {
				console.error("Unexpected error fetching bids:", err);
			}
		};

		initializeBids();
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

						setHighestBids((prev) => {
							const previousBid = prev[bid.itemId];
							if (
								previousBid?.userId &&
								previousBid.userId !== bid.userId &&
								bid.amount > previousBid.amount
							) {
								toast(`You lost the bid for item "${bid.itemId}"`);
							}
							return { ...prev, [bid.itemId]: bid };
						});
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
