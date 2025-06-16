"use client";
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
 *
 * @param params - An object containing optional callbacks and state setters.
 * @param params.setIsLoading - Optional function to set the loading state before and after the fetch.
 * @param params.onLoad - Optional callback invoked with the fetched auction data on success.
 * @param params.onError - Optional callback invoked with an error message if the fetch fails.
 * @returns The fetched auction data on success, or `null` if an error occurs.
 */
export const fetchAuctions = async ({ setIsLoading, onLoad, onError }: iFetchAuctions) => {
	try {
		setIsLoading?.(true);
		const response = await axios.get("/api/auctions");
		console.log("response", response);
		onLoad?.(response.data);
		return response.data;
	} catch (err) {
		onError?.(err instanceof Error ? err.message : "Failed to fetch auctions");
		console.error(err);
	} finally {
		setIsLoading?.(false);
	}

	return null;
};
