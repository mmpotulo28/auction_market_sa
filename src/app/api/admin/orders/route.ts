import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { iOrder, iOrderApiResponse } from "@/lib/types";

// Optionally add authentication/authorization here

export async function GET() {
	try {
		const { data, error } = await supabaseAdmin
			.from("orders")
			.select("*")
			.order("id", { ascending: false })
			.limit(200); // limit for performance

		if (error) {
			console.error("Error fetching orders:", error);
			return NextResponse.json({ error: error.message } as iOrderApiResponse, {
				status: 500,
			});
		}

		return NextResponse.json({ orders: data as iOrder[] } as iOrderApiResponse);
	} catch (err: any) {
		console.error("Unexpected error fetching orders:", err);
		return NextResponse.json(
			{ error: err?.message || "Unexpected error fetching orders." } as iOrderApiResponse,
			{ status: 500 },
		);
	}
}
