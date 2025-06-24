import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import * as Sentry from "@sentry/nextjs";

export async function GET() {
	try {
		const { data, error } = await supabaseAdmin
			.from("emails")
			.select("*")
			.order("date_sent", { ascending: false })
			.limit(100);

		if (error) {
			Sentry.captureException(error);
			console.error("[GET /api/admin/emails] Supabase error:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ data });
	} catch (err: any) {
		Sentry.captureException(err);
		console.error("[GET /api/admin/emails] Exception:", err);
		return NextResponse.json(
			{ error: err?.message || "Internal server error" },
			{ status: 500 },
		);
	}
}
