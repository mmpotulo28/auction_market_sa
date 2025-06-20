import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";

// GET: Fetch all ads
export async function GET() {
	try {
		const { data, error } = await supabaseAdmin
			.from("ads")
			.select("*")
			.order("created_at", { ascending: false });
		if (error) {
			console.error("Ads GET error:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ ads: data });
	} catch (error: any) {
		console.error("Ads GET unexpected error:", error);
		return NextResponse.json(
			{ error: error?.message || "Internal server error" },
			{ status: 500 },
		);
	}
}

// POST: Create a new ad
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { variant, title, description, imageUrl, linkUrl, cta } = body;
		if (!variant || !title || !description || !imageUrl || !linkUrl || !cta) {
			return NextResponse.json({ error: "All fields are required" }, { status: 400 });
		}
		const { error } = await supabaseAdmin
			.from("ads")
			.insert([{ variant, title, description, imageUrl, linkUrl, cta }]);
		if (error) {
			console.error("Ads POST error:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ success: true });
	} catch (error: any) {
		console.error("Ads POST unexpected error:", error);
		return NextResponse.json(
			{ error: error?.message || "Internal server error" },
			{ status: 500 },
		);
	}
}

// DELETE: Delete an ad by id
export async function DELETE(req: NextRequest) {
	try {
		const body = await req.json();
		const id = body?.id;
		if (!id) {
			return NextResponse.json({ error: "Missing ad id" }, { status: 400 });
		}
		const { error } = await supabaseAdmin.from("ads").delete().eq("id", id);
		if (error) {
			console.error("Ads DELETE error:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ success: true });
	} catch (error: any) {
		console.error("Ads DELETE unexpected error:", error);
		return NextResponse.json(
			{ error: error?.message || "Internal server error" },
			{ status: 500 },
		);
	}
}
