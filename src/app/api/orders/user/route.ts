import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
	const { userId } = getAuth(req);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(req.url);
	const page = parseInt(searchParams.get("page") || "1", 10);
	const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
	const from = (page - 1) * pageSize;
	const to = from + pageSize - 1;

	const { data, error, count } = await supabase
		.from("orders")
		.select("*", { count: "exact" })
		.eq("user_id", userId)
		.order("created_at", { ascending: false })
		.range(from, to);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json({ orders: data, total: count });
}
