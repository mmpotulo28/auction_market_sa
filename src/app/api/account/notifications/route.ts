import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import supabase from "@/lib/db";

// Notification type
type Notification = {
	id: string;
	message: string;
	type: string;
	read: boolean;
	created_at?: string;
	user_id?: string;
};

// GET: Fetch notifications for the authenticated user or global (no user_id)
export async function GET(req: NextRequest) {
	try {
		const { userId } = getAuth(req);
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const { data, error } = await supabase
			.from("notifications")
			.select("*")
			.or(`user_id.eq.${userId},user_id.eq.All`)
			.order("created_at", { ascending: false });
		if (error) {
			console.error("Error fetching notifications:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ notifications: data as Notification[] });
	} catch (err: any) {
		console.error("Unexpected error:", err);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

// PATCH: Mark notification as read
export async function PATCH(req: NextRequest) {
	try {
		const { userId } = getAuth(req);
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const body = await req.json();
		const id = body?.id;
		if (!id || typeof id !== "string") {
			return NextResponse.json(
				{ error: "Missing or invalid notification id" },
				{ status: 400 },
			);
		}
		const { error } = await supabase
			.from("notifications")
			.update({ read: true })
			.eq("id", id)
			.or("user_id.eq.All, user_id.eq." + userId);
		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ success: true });
	} catch (err: any) {
		console.error("Unexpected error:", err);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
