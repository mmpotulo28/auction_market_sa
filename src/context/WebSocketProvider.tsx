"use client";
import { iAuctionItem, iBid, iSupabasePayload } from "@/lib/types";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import supabase from "@/lib/db";
import { REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";
import { toast } from "sonner";
import { logger } from "@sentry/nextjs";

interface WebSocketContextProps {
	placeBid: (itemId: string, amount: number, userId: string) => Promise<void>;
	highestBids: Record<string, iBid>;
	bids: iBid[];
	getAllBids: () => Promise<void>;
	items: iAuctionItem[];
	isLoading: boolean;
	error: string[];
	categories: string[];
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [highestBids, setHighestBids] = useState<Record<string, iBid>>({});
	const [items, setItems] = useState<iAuctionItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const [bids, setBids] = useState<iBid[]>([]);

	// Initialize highest bids with mock data and fetch from the database
	useEffect(() => {
		const initializeBids = async () => {
			try {
				setIsLoading(true);
				setError([]);
				const { data: items, error: itemsError } = await supabase.from("items").select("*");

				if (itemsError) {
					throw new Error(`Error fetching items: ${itemsError.message}`);
				}

				setItems(items as iAuctionItem[]);
				setCategories([...new Set(items?.map((item) => item.category))]);

				const mockBidsMap =
					items?.reduce<Record<string, iBid>>((acc, item) => {
						acc[item.id] = {
							itemId: item.id,
							amount: item.price,
							userId: "system",
							timestamp: new Date().toISOString(),
						};
						return acc;
					}, {}) || {};

				setHighestBids(mockBidsMap);

				const { data, error } = await supabase
					.from("bids")
					.select("*")
					.order("timestamp", { ascending: false });

				if (error) {
					logger.error("Error fetching bids:", { error });
					throw new Error(`Error fetching bids: ${error.message}`);
				}

				const dbBidsMap = (data as iBid[]).reduce<Record<string, iBid>>((acc, bid) => {
					if (!acc[bid.itemId] || bid.amount > acc[bid.itemId].amount) {
						acc[bid.itemId] = bid;
					}
					return acc;
				}, {});

				setHighestBids((prev) => ({ ...prev, ...dbBidsMap }));

				// After fetching items and bids, add a field to each item if auction ended
				setItems(
					(items as iAuctionItem[]).map((item) => {
						const auctionEnd =
							item.auction && item.auction.start_time
								? new Date(item.auction.start_time).getTime() +
								  (item.auction.duration || 0) * 60 * 1000
								: 0;
						const now = Date.now();
						return {
							...item,
							sold: auctionEnd > 0 && now > auctionEnd,
						};
					}),
				);
			} catch (err) {
				logger.error("Unexpected error fetching bids:", { err });
				setError((prev) => [...prev, "Unexpected error fetching bids"]);
			} finally {
				setIsLoading(false);
			}
		};

		initializeBids();
		logger.info("WebSocketProvider initialized");
	}, []);

	// Subscribe to real-time updates for the "bids" table
	useEffect(() => {
		const subscription = supabase
			.channel("realtime.public.bids") // Use the "public" schema explicitly
			.on<iSupabasePayload>(
				REALTIME_LISTEN_TYPES.POSTGRES_CHANGES as REALTIME_LISTEN_TYPES.SYSTEM,
				{ event: "*", schema: "public", table: "bids" }, // Use the "public" schema explicitly
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
								toast.info(`You lost the bid for item "${bid.itemId}"`);
							}
							return { ...prev, [bid.itemId]: bid };
						});

						setBids((prev) => [...prev, bid]);
					}
				},
			)
			.subscribe();

		logger.info("WebSocket subscription created");

		return () => {
			supabase.removeChannel(subscription);
		};
	}, []);

	const getAllBids = useCallback(async () => {
		try {
			const { data, error } = await supabase.from("bids").select("*");
			if (error) throw new Error(`Error fetching bids: ${error.message}`);
			setBids((data ?? []) as iBid[]);
		} catch (err) {
			logger.error("Unexpected error fetching bids:", { err });
		}
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
				logger.error("Error placing bid:", { error });
			}
		} catch (err) {
			logger.error("Unexpected error placing bid:", { err });
		}
	}, []);

	return (
		<WebSocketContext.Provider
			value={{
				placeBid,
				highestBids,
				items,
				isLoading,
				error,
				categories,
				getAllBids,
				bids,
			}}>
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
