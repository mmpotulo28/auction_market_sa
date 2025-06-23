import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { iAuctionItem } from "@/lib/types";
import { logger } from "@sentry/nextjs";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");
	if (!id) {
		return NextResponse.json({ error: "Missing item id" }, { status: 400 });
	}
	const { data, error } = await supabaseAdmin.from("items").select("*").eq("id", id).single();

	if (error) {
		logger.error("[GET /api/items/item] Supabase error:", { error });
		return NextResponse.json({ error: error.message }, { status: 404 });
	}
	return NextResponse.json({ item: data as iAuctionItem });
}
