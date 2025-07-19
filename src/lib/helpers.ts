import axios from "axios";
import { iAuction, iGroupedOrder, iOrder, iOrderStatus } from "./types";

/**
 * Converts a given string into a URL-friendly format.
 *
 * The function transforms the input string to lowercase, replaces
 * non-alphanumeric characters with hyphens, and removes leading
 * or trailing hyphens.
 *
 * @param str - The input string to be converted.
 * @returns The URL-friendly version of the input string.
 */
export const stringToUrl = (str: string): string => {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
};

/**
 * Converts a Date object to a formatted string in US English locale.
 *
 * The output format includes the weekday, day, month, year, hour, and minute,
 * and uses the UTC time zone.
 *
 * @param date - The Date object to format.
 * @returns A formatted date string, or an empty string if the input is invalid.
 */
export const dateToString = (date: Date) => {
	if (!date) return "";
	if (isNaN(date.getTime()) || !(date instanceof Date)) return "";
	return date.toLocaleString("en-US", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "UTC",
	});
};

export interface iFetchAuctions {
	setIsLoading?: (isLoading: boolean) => void;
	onLoad?: (data: iAuction[]) => void;
	onError?: (error: string) => void;
}

/**
 * Fetches auction data from the `/api/auctions` endpoint.
 * Caches the result in a cookie for 5 minutes (client-side only).
 */
export const fetchAuctions = async ({ setIsLoading, onLoad, onError }: iFetchAuctions) => {
	try {
		setIsLoading?.(true);

		const cookieName = "auction_cache";
		const cacheDuration = 1 * 60 * 1000; // 1 minute in ms

		// Only cache on client side
		if (typeof window !== "undefined") {
			const cached = (() => {
				try {
					const match = document.cookie.match(
						new RegExp("(^| )" + cookieName + "=([^;]+)"),
					);
					if (!match) return null;
					const value = decodeURIComponent(match[2]);
					const parsed = JSON.parse(value);
					if (parsed && parsed.data && parsed.timestamp) {
						if (Date.now() - parsed.timestamp < cacheDuration) {
							return parsed.data;
						}
					}
				} catch (error) {
					// ignore parse errors
					console.error("Failed to parse auction cache:", error);
					return [];
				}

				return [];
			})();

			if (cached && cached.length > 0) {
				console.log("auctions (cache):", cached);
				onLoad?.(cached);
				setIsLoading?.(false);
				return cached;
			}
		}

		const url = "/api/auctions";
		const response = await fetch(url);
		const data = (await response.json()) || [];

		// Set cookie (client-side only)
		if (typeof window !== "undefined") {
			const cookieValue = encodeURIComponent(JSON.stringify({ data, timestamp: Date.now() }));
			document.cookie = `${cookieName}=${cookieValue}; max-age=300; path=/`;
		}

		onLoad?.(data);
		return data;
	} catch (err) {
		onError?.(err instanceof Error ? err.message : "Failed to fetch auctions");
		console.error(`Failed to fetch auctions: ${err}`);
	} finally {
		setIsLoading?.(false);
	}

	return [];
};

// Fetch auction by name with improved efficiency and error handling
export const fetchAuctionByName = async (name: string): Promise<iAuction | undefined> => {
	try {
		const auctions: iAuction[] = await fetchAuctions({});

		if (auctions.length === 0 || !name) return undefined;

		const normalizedTarget = stringToUrl(name);

		// Use a for loop for early exit on match (more efficient than .find for large arrays)
		for (const auction of auctions) {
			if (stringToUrl(auction.name) === normalizedTarget) {
				return auction;
			}
		}
		return undefined;
	} catch (error) {
		console.error(`Failed to fetch auction by name: ${name}`, error);
		return undefined;
	}
};

/**
 * Sends a notification to a user via the notifications API.
 * @param userId - The user ID to notify.
 * @param message - The notification message.
 * @param type - The notification type ("info", "success", "warning", "error").
 * @returns {Promise<{ success: boolean; error?: string }>}
 */
export const sendNotification = async (
	userId: string,
	message: string,
	type: string = "info",
): Promise<{ success: boolean; error?: string }> => {
	try {
		const res = await axios.post("/api/admin/notifications", {
			user_id: userId || "All",
			message,
			type,
		});
		if (res.data && res.data.success) {
			return { success: true };
		}
		return { success: false, error: res.data?.error || "Unknown error sending notification" };
	} catch (e: any) {
		let errorMsg = "Failed to send notification.";
		if (e?.response?.data?.error) errorMsg = e.response.data.error;
		else if (e?.message) errorMsg = e.message;
		console.error("Notification error:", errorMsg);
		return { success: false, error: errorMsg };
	}
};

export function statusColor(status: iOrderStatus | "COMPLETE") {
	switch (status) {
		case iOrderStatus.Completed:
		case iOrderStatus.Pending:
		case "COMPLETE":
			return "bg-green-100 text-green-700";
		case iOrderStatus.Cancelled:
		case iOrderStatus.Failed:
			return "bg-red-100 text-red-700";
		case iOrderStatus.Unpaid:
		default:
			return "bg-yellow-100 text-yellow-700";
	}
}

// Function to group orders by order_id
export const groupOrdersByOrderId = (orders: iOrder[]): iGroupedOrder[] => {
	const grouped = orders.reduce((acc, order) => {
		const orderId = order.order_id;
		if (!acc[orderId]) {
			acc[orderId] = {
				order_id: orderId,
				user_name: `${order.user_first_name || ""} ${order.user_last_name || ""}`.trim(),
				user_email: order.user_email || "",
				created_at: order.created_at,
				items_count: 0,
				total_amount: 0,
				order_status: order.order_status,
				orders: [],
				payment_id: order.payment_id || "",
				user_id: order.user_id || "",
			};
		}
		acc[orderId].orders.push(order);
		acc[orderId].items_count = acc[orderId].orders.length;
		acc[orderId].total_amount += order.price || 0;

		// Use the latest status or highest priority status
		const statusPriority = {
			[iOrderStatus.Failed]: 6,
			[iOrderStatus.Cancelled]: 5,
			[iOrderStatus.Unpaid]: 4,
			[iOrderStatus.Pending]: 3,
			[iOrderStatus.Processing]: 2,
			[iOrderStatus.Completed]: 1,
			[iOrderStatus.Refunded]: 7,
			[iOrderStatus.Expired]: 8,
		};

		if (statusPriority[order.order_status] > statusPriority[acc[orderId].order_status]) {
			acc[orderId].order_status = order.order_status;
		}

		return acc;
	}, {} as Record<string, iGroupedOrder>);

	return Object.values(grouped);
};

interface iFetchOrdersResponse {
	orders: iOrder[];
	groupedOrders: iGroupedOrder[];
	error: string | null;
}

export async function fetchOrders({
	page,
	pageSize = 15,
}: {
	page: number;
	pageSize?: number;
}): Promise<iFetchOrdersResponse> {
	try {
		const res = await axios.get(`/api/admin/orders?page=${page}&pageSize=${pageSize}`);
		if (res.data && Array.isArray(res.data.orders)) {
			// Group orders by order_id
			const grouped = groupOrdersByOrderId(res.data.orders);

			return { orders: res.data.orders, groupedOrders: grouped, error: null };
		} else {
			return { orders: [], groupedOrders: [], error: "Invalid response from server." };
		}
	} catch (e: any) {
		let msg = "Failed to fetch orders.";
		if (e?.response?.data?.error) msg = e.response.data.error;
		else if (e?.message) msg = e.message;
		return { orders: [], groupedOrders: [], error: msg };
	}
}
