import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { ensureTransactionsTable } from "@/lib/payfast";

// Optionally add authentication/authorization here

export async function GET() {
	try {
		await ensureTransactionsTable();
		const { data, error } = await supabaseAdmin
			.from("transactions")
			.select("*")
			.order("id", { ascending: false })
			.limit(200); // limit for performance

		if (error) {
			console.error("Error fetching transactions:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ transactions: data });
	} catch (err: any) {
		console.error("Unexpected error fetching transactions:", err);
		return NextResponse.json(
			{ error: err?.message || "Unexpected error fetching transactions." },
			{ status: 500 },
		);
	}
}
