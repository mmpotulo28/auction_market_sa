"use client";
import { iBid } from "@/lib/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
interface WebSocketContextProps {
	placeBid: (itemId: string, amount: number, userId: string) => void;
	highestBids: Record<string, iBid>;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [highestBids, setHighestBids] = useState<Record<string, iBid>>({});

	useEffect(() => {
		// Connect to the /auction namespace
		const socketInstance = io(`${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}/auction`, {
			path: "/socket.io",
			autoConnect: true,
		});

		socketInstance.connect();

		socketInstance.on("connect", () => {
			console.log("Connected to WebSocket server", socketInstance.id);
			setSocket(socketInstance);
		});

		// on error
		socketInstance.on("connect_error", (error) => {
			console.error("WebSocket connection error:", error);
		});

		socketInstance.on("disconnect", (reason) => {
			console.log("Disconnected from WebSocket server:", reason);
			setSocket(null);
		});

		socketInstance.on("NEW_HIGHEST_BID", (bid: iBid) => {
			console.log("New highest bid received:", bid.itemId, bid.amount);
			setHighestBids((prevHighestBids) => ({
				...prevHighestBids,
				[bid.itemId]: bid,
			}));
		});

		socketInstance.on("HIGHEST_BIDS", ({ id, highestBids: emittedHighestBids }) => {
			if (id === socketInstance.id) {
				console.log("Overriding highest bids with emitted data:", emittedHighestBids);
				setHighestBids(emittedHighestBids);
			} else {
				console.log("Received highest bids for a different user:", id);
			}
		});

		return () => {
			socketInstance.disconnect();
			setSocket(null);
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
			console.error("Error: cannot place bids, socket not connected");
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
