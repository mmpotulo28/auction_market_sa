import supabase from "./db";
import { iTransaction } from "./types";
import axios from "axios";

export async function ensureTransactionsTable() {
	try {
		// Only attempt to ensure table if running as an admin/service role
		// If permission denied, log a warning and skip
		const { error } = await supabase.rpc("ensure_transactions_table");
		if (error) {
			if (error.message && error.message.toLowerCase().includes("permission denied")) {
				console.warn(
					"Permission denied when trying to ensure transactions table exists. " +
						"Please ensure the table is created manually by a privileged user. " +
						"Skipping ensure_transactions_table.",
				);
			} else {
				console.error("Failed to ensure transactions table exists. Error:", error.message);
			}
		}
	} catch (err) {
		console.error(
			"Exception while ensuring transactions table exists. " +
				"Please ensure the table exists and your service role has the correct privileges. Error:",
			err instanceof Error ? err.message : err,
		);
	}
}

export async function storeTransaction(tx: iTransaction) {
	await ensureTransactionsTable();
	await supabase.from("transactions").insert([tx]);
}

export async function validatePayfastIPN(params: Record<string, string>) {
	// Validate source IP, signature, and post back to PayFast for verification
	// For demo, only post back to PayFast
	const pfHost = "https://sandbox.payfast.co.za";
	const verifyUrl = `${pfHost}/eng/query/validate`;

	try {
		const res = await axios.post(verifyUrl, new URLSearchParams(params), {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});
		return res.data === "VALID";
	} catch {
		return false;
	}
}
