import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";

// Notification type
type Notification = {
	id: string;
	message: string;
	type: string;
	read: boolean;
	created_at?: string;
	user_id?: string;
	admin_only?: boolean;
};

// GET: Admin fetch all notifications
export async function GET() {
	try {
		const { data, error } = await supabaseAdmin
			.from("notifications")
			.select("*")
			.order("created_at", { ascending: false });
		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ notifications: data as Notification[] });
	} catch (err: any) {
		console.error("Unexpected error:", err);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

// POST: Admin create notification (global or user)
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { user_id, message, type, admin_only } = body;
		if (!message || typeof message !== "string") {
			return NextResponse.json({ error: "Message is required" }, { status: 400 });
		}
		const { error } = await supabaseAdmin
			.from("notifications")
			.insert([{ user_id, message, type, admin_only }]);
		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ success: true });
	} catch (err: any) {
		console.error("Unexpected error:", err);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

// DELETE: Admin delete notification
export async function DELETE(req: NextRequest) {
	try {
		const body = await req.json();
		const id = body?.id;
		if (!id || typeof id !== "string") {
			return NextResponse.json({ error: "Missing notification id" }, { status: 400 });
		}
		const { error } = await supabaseAdmin.from("notifications").delete().eq("id", id);
		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ success: true });
	} catch (err: any) {
		console.error("Unexpected error:", err);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
