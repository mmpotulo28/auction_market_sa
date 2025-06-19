import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { iAuctionItem } from "@/lib/types";

export async function GET(req: Request, { params }: { params: { id: string } }) {
	const { id } = params;
	if (!id) {
		return NextResponse.json({ error: "Missing item id" }, { status: 400 });
	}
	const { data, error } = await supabaseAdmin.from("items").select("*").eq("id", id).single();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 404 });
	}
	return NextResponse.json({ item: data as iAuctionItem });
}
