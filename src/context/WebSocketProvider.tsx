"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { iBid, iBidHistory } from "@/lib/types";

interface WebSocketContextProps {
	placeBid: (itemId: string, amount: number, userId: string) => void;
	getHighestBid: (itemId: string) => iBid | undefined;
	data: iBid | null;
	history: iBidHistory | null;
	fetchBidHistory: (itemId: string) => void; // New method
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [data, setData] = useState<iBid | null>(null);
	const [bids, setBids] = useState<Record<string, iBid>>({});
	const [history, setHistory] = useState<iBidHistory | null>(null);

	useEffect(() => {
		// Connect to the /auction namespace
		const socketInstance = io(`${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}/auction`, {
			path: "/socket.io",
		});
		socketInstance.connect();

		socketInstance.on("connect", () => {
			console.log("Connected to WebSocket server", socketInstance);
		});

		// on error
		socketInstance.on("connect_error", (error) => {
			console.error("WebSocket connection error:", error);
		});

		console.log("socketInstance", socketInstance);
		setSocket(socketInstance);

		socketInstance.on("BID_UPDATE", (bid: iBid) => {
			const { itemId, amount, userId } = bid;

			// Update the local bids state
			setBids((prevBids) => ({
				...prevBids,
				[itemId]: { itemId, amount, userId, timestamp: new Date().toISOString() },
			}));

			setData(bid);
		});

		socketInstance.on("NEW_BID", (bid: iBid) => {
			// Update the local bids state
			setBids((prevBids) => ({
				...prevBids,
				[bid.itemId]: {
					itemId: bid.itemId,
					amount: bid.amount,
					userId: bid.userId,
					timestamp: bid.timestamp,
				},
			}));
		});

		socketInstance.on("BID_HISTORY", (history: iBidHistory) => {
			console.log("Bid history:", history);
			setHistory(history);
		});

		return () => {
			socketInstance.disconnect();
		};
	}, []);

	const placeBid = (itemId: string, amount: number, userId: string) => {
		if (socket) {
			socket.emit("PLACE_BID", {
				itemId,
				amount,
				userId,
				timestamp: new Date().toISOString(),
			});
		} else {
			console.log("Socket not connected");
		}
	};

	const getHighestBid = (itemId: string): iBid | undefined => {
		return bids[itemId];
	};

	const fetchBidHistory = (itemId: string) => {
		if (socket) {
			socket.emit("FETCH_BID_HISTORY", { itemId });
		}
	};

	return (
		<WebSocketContext.Provider
			value={{ placeBid, getHighestBid, data, fetchBidHistory, history }}>
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
