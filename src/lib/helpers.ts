import axios, { isAxiosError } from "axios";
import {
	iAuction,
	iGroupedOrder,
	iNotification,
	iOrder,
	iOrderStatus,
	iTransaction,
} from "./types";
import { logger } from "@sentry/nextjs";
import supabase, { supabaseAdmin } from "@/lib/db";
import { NextRequest } from "next/server";

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
 * Fetches auctions from the server and caches them in a cookie for 5 minutes.
 *
 * This function retrieves auctions from the API, caches them in a cookie,
 * and returns the cached data if available. It handles errors and allows
 * for custom loading and error handling callbacks.
 *
 * @param params - The parameters for fetching auctions.
 * @returns A promise that resolves to an array of `iAuction` objects.
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

/**
 * Fetches an auction by its name.
 *
 * This function retrieves all auctions and searches for an auction whose normalized name matches
 * the provided name. The normalization is performed using the `stringToUrl` utility to ensure
 * consistent comparison. Returns the matching auction if found, otherwise returns `undefined`.
 *
 * @param name - The name of the auction to search for.
 * @returns A promise that resolves to the matching `iAuction` object if found, or `undefined` if not found or on error.
 */
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
/**
 * Sends a notification to a specific user or all users via the admin notifications API.
 *
 * @param userId - The ID of the user to send the notification to. If not provided, defaults to "All".
 * @param message - The notification message to be sent.
 * @param type - The type of notification (e.g., "info", "warning", "error"). Defaults to "info".
 * @returns A promise that resolves to an object indicating success or failure, and an optional error message.
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

/**
 * Returns the appropriate Tailwind CSS classes for the given order status.
 *
 * @param status - The status of the order, which can be a value from the `iOrderStatus` enum or the string "COMPLETE".
 * @returns A string containing Tailwind CSS classes for background and text color based on the order status.
 */
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

/**
 * Groups an array of orders by their `order_id`, aggregating order details and computing summary fields.
 *
 * Each group contains:
 * - The user's name and email.
 * - The creation date of the order.
 * - The total number of items (`items_count`).
 * - The total amount for the order (`total_amount`).
 * - The highest priority order status among the grouped orders.
 * - The payment ID and user ID.
 * - An array of the original orders belonging to the group.
 *
 * The order status is determined by the highest priority status found in the group, based on a predefined priority mapping.
 *
 * @param orders - An array of `iOrder` objects to be grouped.
 * @returns An array of `iGroupedOrder` objects, each representing a group of orders with the same `order_id`.
 */
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

/**
 * Fetches orders from the server with pagination and groups them by order ID.
 *
 * @param params - The parameters for fetching orders.
 * @param params.page - The page number to fetch.
 * @param params.pageSize - The number of orders per page (default is 15).
 * @returns A promise that resolves to an object containing the original orders, grouped orders, and an error message if any.
 *
 * @example
 * const { orders, groupedOrders, error } = await fetchOrders({ page: 1, pageSize: 20 });
 */
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

			logger.info("Fetched orders:", res.data.orders.length);
			logger.info("Grouped orders:", { length: grouped.length });

			return { orders: res.data.orders, groupedOrders: grouped, error: null };
		} else {
			return { orders: [], groupedOrders: [], error: "Invalid response from server." };
		}
	} catch (e: any) {
		logger.error("Error fetching orders:", e);
		let msg = "Failed to fetch orders.";
		if (e?.response?.data?.error) msg = e.response.data.error;
		else if (e?.message) msg = e.message;
		return { orders: [], groupedOrders: [], error: msg };
	}
}

/**
 * Fetches a paginated list of transactions from the server.
 *
 * @param params - The parameters for fetching transactions.
 * @param params.page - The current page number to fetch.
 * @param params.pageSize - The number of transactions per page (default is 15).
 * @returns A promise that resolves to an object containing the list of transactions and an error message if any.
 *
 * @example
 * const { transactions, error } = await fetchTransactions({ page: 1, pageSize: 20 });
 */
export async function fetchTransactions({
	page,
	pageSize = 15,
}: {
	page: number;
	pageSize?: number;
}): Promise<{ transactions: iTransaction[]; error: string | null }> {
	try {
		const res = await axios.get(`/api/admin/transactions?page=${page}&pageSize=${pageSize}`);
		if (res.data && Array.isArray(res.data.transactions)) {
			logger.info("Fetched transactions:", res.data.transactions.length);
			return { transactions: res.data.transactions, error: null };
		} else {
			return { transactions: [], error: "Invalid response from server." };
		}
	} catch (e: any) {
		logger.error("Error fetching transactions:", e);
		let msg = "Failed to fetch transactions.";
		if (e?.response?.data?.error) msg = e.response.data.error;
		else if (e?.message) msg = e.message;
		return { transactions: [], error: msg };
	}
}

/**
 * Fetches notifications from the admin notifications API endpoint.
 *
 * @returns A promise that resolves to an object containing an array of notifications and an optional error message.
 *
 * @remarks
 * - If the request is successful and notifications are found, returns the notifications.
 * - If no notifications are found, returns an empty array with an error message.
 * - Handles Axios errors and unexpected errors, returning an appropriate error message.
 *
 * @example
 * ```typescript
 * const { notifications, error } = await fetchNotifications();
 * if (error) {
 *   // Handle error
 * }
 * ```
 */
export async function fetchNotifications(): Promise<{
	notifications: iNotification[];
	error?: string;
}> {
	try {
		const res = await axios.get<{ notifications: iNotification[]; error?: string }>(
			"/api/admin/notifications",
		);

		const data = res.data;
		if (data.notifications) {
			return { notifications: data.notifications };
		} else {
			return { notifications: [], error: "No notifications found." };
		}
	} catch (e: unknown) {
		if (isAxiosError(e)) {
			return { notifications: [], error: e.response?.data?.error || e.message };
		} else {
			return {
				notifications: [],
				error: "An unexpected error occurred while fetching notifications.",
			};
		}
	}
}

// Helper to upload images and return their URLs and paths
/**
 * Uploads an array of image files to the Supabase storage bucket "amsa-public".
 *
 * Each image is assigned a unique filename to avoid collisions. The function uploads all images in parallel,
 * and returns the public URLs and storage paths of the uploaded images.
 *
 * @param imageFiles - An array of `File` objects representing the images to upload.
 * @returns A promise that resolves to an object containing:
 *   - `urls`: An array of public URLs for the uploaded images.
 *   - `paths`: An array of storage paths for the uploaded images.
 * @throws If any image fails to upload, an error is thrown with details about the failure.
 */
export async function uploadImages(
	imageFiles: File[],
): Promise<{ urls: string[]; paths: string[] }> {
	// Validate file types and sizes
	const { valid, error } = validateFiles(imageFiles);
	if (error || !valid) {
		return Promise.reject(`Invalid files: ${error || "Unknown error"}`);
	}

	const imageUrls: string[] = [];
	const uploadedImagePaths: string[] = [];
	const uploadResults = await Promise.all(
		imageFiles.map(async (imageFile: File, idx: number) => {
			const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1e6)}-${idx}`;
			const fileName = `images/${uniqueSuffix}-${imageFile.name}`;
			const { data, error: uploadError } = await supabaseAdmin.storage
				.from("amsa-public")
				.upload(fileName, imageFile);

			if (uploadError) {
				throw new Error(
					`Failed to upload image to storage: ${uploadError.message}\n Caused by: ${uploadError.cause}`,
				);
			}

			return {
				url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/amsa-public/${data.path}`,
				path: data.path,
			};
		}),
	);

	for (const result of uploadResults) {
		imageUrls.push(result.url);
		uploadedImagePaths.push(result.path);
	}
	return { urls: imageUrls, paths: uploadedImagePaths };
}

// Helper to delete images from storage
/**
 * Deletes images from the "amsa-public" Supabase storage bucket based on the provided file paths.
 *
 * @param paths - An array of string paths representing the images to be deleted.
 * @returns An object indicating the result of the deletion operation:
 * - `{ success: true }` if deletion was successful.
 * - `{ error: string }` if an error occurred during deletion.
 * - `{ success: false, error: string }` if no paths were provided.
 */
export async function deleteImages(paths: string[]) {
	if (paths.length > 0) {
		const { error: deleteError } = await supabase.storage.from("amsa-public").remove(paths);

		if (deleteError) {
			return { error: deleteError.message };
		}

		return { success: true };
	}

	return { success: false, error: "No paths provided for deletion." };
}

// Helper to parse FormData for PUT
/**
 * Parses multipart form data from a Next.js request and extracts relevant fields.
 *
 * @param req - The incoming NextRequest containing form data.
 * @returns An object containing:
 *   - `id`: The string value of the "id" field from the form data.
 *   - `fields`: An object with the following properties:
 *       - `title`: The string value of the "title" field, or an empty string if not present.
 *       - `description`: The string value of the "description" field, or an empty string if not present.
 *       - `price`: The string value of the "price" field, or "0" if not present.
 *       - `category`: The string value of the "category" field, or an empty string if not present.
 *       - `condition`: The string value of the "condition" field, or an empty string if not present.
 *       - `auction_id`: The value of the "auctionId" field, or null if not present.
 *   - `imageFiles`: An array of File objects from the "imageFiles" field.
 */
export async function parseFormData(req: NextRequest) {
	const formData = await req.formData();
	const id = formData.get("id") as string;
	const fields: any = {
		title: (formData.get("title") as string) || "",
		description: (formData.get("description") as string) || "",
		price: (formData.get("price") as string) || "0",
		category: (formData.get("category") as string) || "",
		condition: (formData.get("condition") as string) || "",
		auction_id: formData.get("auctionId") || null,
	};
	const imageFiles = formData.getAll("imageFiles") as File[];
	return { id, fields, imageFiles };
}

/**
 * Validates an array of files for allowed types and size.
 * @param files - Array of File objects.
 * @param options - Validation options.
 * @returns { valid: boolean, error?: string }
 */
export function validateFiles(
	files: File[],
	options: { allowedTypes?: string[]; maxSizeMB?: number } = {},
): { valid: boolean; error?: string } {
	const { allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"], maxSizeMB = 5 } =
		options;
	for (const file of files) {
		if (!allowedTypes.includes(file.type)) {
			return { valid: false, error: `File type not allowed: ${file.name}` };
		}
		if (file.size > maxSizeMB * 1024 * 1024) {
			return {
				valid: false,
				error: `File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
			};
		}
	}
	return { valid: true };
}
