import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import supabase from "@/lib/db";

// GET: Fetch notifications for the authenticated user
export async function GET(req: NextRequest) {
	const { userId } = getAuth(req);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const { data, error } = await supabase
		.from("notifications")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });
	if (error) {
		console.error("Error fetching notifications:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json({ notifications: data });
}

// PATCH: Mark notification as read
export async function PATCH(req: NextRequest) {
	const { userId } = getAuth(req);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const { id } = await req.json();
	if (!id) {
		return NextResponse.json({ error: "Missing notification id" }, { status: 400 });
	}
	const { error } = await supabase
		.from("notifications")
		.update({ read: true })
		.eq("id", id)
		.eq("user_id", userId);
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json({ success: true });
}
