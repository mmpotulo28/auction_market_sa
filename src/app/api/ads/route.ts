import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";

export async function GET(req: NextRequest) {
	try {
		const { data, error } = await supabaseAdmin
			.from("ads")
			.select("*")
			.order("created_at", { ascending: false });
		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ ads: data });
	} catch (err: any) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

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
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ success: true });
	} catch (err: any) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const body = await req.json();
		const id = body?.id;
		if (!id) {
			return NextResponse.json({ error: "Missing ad id" }, { status: 400 });
		}
		const { error } = await supabaseAdmin.from("ads").delete().eq("id", id);
		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ success: true });
	} catch (err: any) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
