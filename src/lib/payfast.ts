import supabase from "./db";
import { iTransaction } from "./types";
import axios from "axios";

export async function ensureTransactionsTable() {
	const { error } = await supabase.rpc("ensure_transactions_table");
	if (error) {
		console.error("Failed to ensure transactions table exists:", error.message);
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
