import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { ensureTransactionsTable } from "@/lib/payfast";

// Optionally add authentication/authorization here

export async function GET(req: NextRequest) {
	try {
		await ensureTransactionsTable();
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const pageSize = parseInt(searchParams.get("pageSize") || "15", 10);
		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		const { data, error, count } = await supabaseAdmin
			.from("transactions")
			.select("*", { count: "exact" })
			.order("id", { ascending: false })
			.range(from, to);

		if (error) {
			console.error("Error fetching transactions:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ transactions: data, total: count });
	} catch (err: any) {
		console.error("Unexpected error fetching transactions:", err);
		return NextResponse.json(
			{ error: err?.message || "Unexpected error fetching transactions." },
			{ status: 500 },
		);
	}
}
