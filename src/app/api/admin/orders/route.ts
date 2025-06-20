import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { iOrder, iOrderApiResponse } from "@/lib/types";

// Optionally add authentication/authorization here

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const pageSize = parseInt(searchParams.get("pageSize") || "15", 10);
		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		const { data, error, count } = await supabaseAdmin
			.from("orders")
			.select("*", { count: "exact" })
			.order("id", { ascending: false })
			.range(from, to);

		if (error) {
			console.error("Error fetching orders:", error);
			return NextResponse.json({ error: error.message } as iOrderApiResponse, {
				status: 500,
			});
		}

		return NextResponse.json({
			orders: data as iOrder[],
			total: count,
		} as iOrderApiResponse);
	} catch (err: any) {
		console.error("Unexpected error fetching orders:", err);
		return NextResponse.json(
			{ error: err?.message || "Unexpected error fetching orders." } as iOrderApiResponse,
			{ status: 500 },
		);
	}
}
