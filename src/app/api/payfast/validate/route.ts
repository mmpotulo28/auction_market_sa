import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { ensureTransactionsTable } from "@/lib/payfast";
import { logger } from "@sentry/nextjs";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const pf_payment_id = searchParams.get("pf_payment_id");
	const m_payment_id = searchParams.get("m_payment_id");

	await ensureTransactionsTable();

	if (!pf_payment_id && !m_payment_id) {
		return NextResponse.json({ error: "Missing payment id" }, { status: 400 });
	}

	let query = supabaseAdmin
		.from("transactions")
		.select("*")
		.order("id", { ascending: false })
		.limit(1);

	if (pf_payment_id) {
		query = query.eq("pf_payment_id", pf_payment_id);
	}
	if (m_payment_id) {
		query = query.eq("m_payment_id", m_payment_id);
	}

	const { data, error } = await query.single();

	if (error) {
		logger.error("Supabase error:", { error });
		return NextResponse.json({ error: error.message }, { status: 404 });
	}

	return NextResponse.json({ transaction: data });
}
