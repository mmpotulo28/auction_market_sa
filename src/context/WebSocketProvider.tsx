"use client";
import { iBid, iSupabasePayload } from "@/lib/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "@/lib/db";
import { REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";

interface WebSocketContextProps {
	placeBid: (itemId: string, amount: number, userId: string) => void;
	highestBids: Record<string, iBid>;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [highestBids, setHighestBids] = useState<Record<string, iBid>>({});

	useEffect(() => {
		// Subscribe to the "bids" table for real-time updates
		const subscription = supabase
			.channel("realtime.public.bids")
			.on<iSupabasePayload>(
				REALTIME_LISTEN_TYPES.POSTGRES_CHANGES as REALTIME_LISTEN_TYPES.SYSTEM,
				{ event: "*", schema: "public", table: "bids" },
				(payload: iSupabasePayload) => {
					if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
						const bid = payload.new as iBid;
						console.log("New or updated bid received:", bid);
						setHighestBids((prevHighestBids) => ({
							...prevHighestBids,
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

	useEffect(() => {
		console.log("Updated highest bids:", highestBids);
	}, [highestBids]);

	const placeBid = async (itemId: string, amount: number, userId: string) => {
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

			console.log("Bid placed successfully:", { itemId, amount, userId });
		} catch (err) {
			console.error("Unexpected error placing bid:", err);
		}
	};

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
