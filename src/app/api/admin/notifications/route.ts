import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";

// GET: Admin fetch all notifications
export async function GET() {
	const { data, error } = await supabaseAdmin
		.from("notifications")
		.select("*")
		.order("created_at", { ascending: false });
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json({ notifications: data });
}

// POST: Admin create notification (global or user)
export async function POST(req: NextRequest) {
	const { user_id, message, type, admin_only } = await req.json();
	if (!message) {
		return NextResponse.json({ error: "Message is required" }, { status: 400 });
	}
	const { error } = await supabaseAdmin
		.from("notifications")
		.insert([{ user_id, message, type, admin_only }]);
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json({ success: true });
}

// DELETE: Admin delete notification
export async function DELETE(req: NextRequest) {
	const { id } = await req.json();
	if (!id) {
		return NextResponse.json({ error: "Missing notification id" }, { status: 400 });
	}
	const { error } = await supabaseAdmin.from("notifications").delete().eq("id", id);
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json({ success: true });
}
