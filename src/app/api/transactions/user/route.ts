import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { iTransaction } from "@/lib/types";
import { logger } from "@sentry/nextjs";

export async function GET(req: NextRequest) {
	try {
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
			.from("transactions")
			.select("*", { count: "exact" })
			.eq("custom_str1", userId)
			.order("created_at", { ascending: false })
			.range(from, to);

		if (error) {
			logger.error("[GET /api/transactions/user] Supabase error:", { error });
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ transactions: data as iTransaction[], total: count });
	} catch (err: any) {
		logger.error("[GET /api/transactions/user] Exception:", { err });
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
