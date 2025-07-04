import { NextRequest, NextResponse } from "next/server";
import supabase, { supabaseAdmin } from "@/lib/db";
import { iAuctionItem, iOrder, iOrderApiResponse } from "@/lib/types";
import { logger } from "@sentry/nextjs";

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

		// fetch items and bind them with an order
		const { data: items, error: itemsError } = await supabase
			.from("items")
			.select("*")
			.in("id", data?.map((order: iOrder) => order.item_id) ?? []);

		if (itemsError) {
			console.error("Error fetching items:", itemsError);
			logger.error("Error fetching items:", { error: itemsError, data });
			return NextResponse.json({ error: itemsError.message } as iOrderApiResponse, {
				status: 500,
			});
		}

		data?.forEach((order: iOrder) => {
			order.item = items.find((item: iAuctionItem) => item.id == order.item_id);
		});

		if (error) {
			console.error("Error fetching orders:", error);
			logger.error("Error fetching orders:", { error, data });
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
		logger.error("Unexpected error fetching orders:", { err });
		return NextResponse.json(
			{ error: err?.message || "Unexpected error fetching orders." } as iOrderApiResponse,
			{ status: 500 },
		);
	}
}
