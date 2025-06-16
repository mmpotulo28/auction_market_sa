import axios from "axios";
import { iAuction } from "./types";

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
		const cacheDuration = 5 * 60 * 1000; // 5 minutes in ms

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
				} catch {
					// ignore parse errors
				}
				return null;
			})();

			if (cached) {
				onLoad?.(cached);
				setIsLoading?.(false);
				return cached;
			}
		}

		const url = "/api/auctions";
		const response = (await axios.get(url)) || { data: [] };
		const data = response.data || [];

		// Set cookie (client-side only)
		if (typeof window !== "undefined") {
			const cookieValue = encodeURIComponent(JSON.stringify({ data, timestamp: Date.now() }));
			document.cookie = `${cookieName}=${cookieValue}; max-age=300; path=/`;
		}

		onLoad?.(data);
		return data;
	} catch (err) {
		onError?.(err instanceof Error ? err.message : "Failed to fetch auctions");
		console.error(err);
	} finally {
		setIsLoading?.(false);
	}

	return null;
};
