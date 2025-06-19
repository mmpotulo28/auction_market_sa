import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";

export async function PUT(req: Request) {
	try {
		const { order_id, status } = await req.json();
		if (!order_id || !status) {
			return NextResponse.json({ error: "Missing order_id or status" }, { status: 400 });
		}
		const { error } = await supabaseAdmin
			.from("orders")
			.update({ order_status: status })
			.eq("order_id", order_id);
		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ success: true });
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || "Failed to update order status." },
			{ status: 500 },
		);
	}
}
