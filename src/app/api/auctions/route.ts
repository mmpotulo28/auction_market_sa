"use server";
import { NextResponse } from "next/server";
import supabase from "@/lib/db";
import { iAuction } from "@/lib/types";

export async function GET() {
	console.log("fetching apis");
	try {
		const { data, error } = await supabase
			.from("auctions")
			.select("*")
			.order("id", { ascending: false });

		if (error) {
			console.error("[GET /api/auctions] Supabase error:", error.message);
			throw new Error(`Failed to fetch auctions: ${error.message}`);
		}

		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("[GET /api/auctions] Exception:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const {
			name,
			items_count,
			start_time,
			duration,
			re_open_count,
			description,
			created_by,
			// id, // Do NOT include id in insert payload
		} = body;

		if (!name || !items_count || !start_time || !duration || !re_open_count || !created_by) {
			console.warn("[POST /api/auctions] Missing required fields:", body);
			return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
		}

		// Remove id from insert payload if present
		const insertPayload = {
			name,
			items_count,
			start_time,
			duration,
			re_open_count,
			description,
			created_by,
		};

		const { data, error } = await supabase.from("auctions").insert([insertPayload]).select();

		if (error) {
			console.error("[POST /api/auctions] Supabase error:", error.message);
			throw new Error(`Failed to add auction: ${error.message}`);
		}

		return NextResponse.json(data, { status: 201 });
	} catch (error) {
		console.error("[POST /api/auctions] Exception:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get("id");

		if (!id) {
			console.warn("[DELETE /api/auctions] Missing auction ID in query params.");
			return NextResponse.json({ error: "Missing auction ID." }, { status: 400 });
		}

		const { error } = await supabase.from("auctions").delete().eq("id", id);

		if (error) {
			console.error("[DELETE /api/auctions] Supabase error:", error.message);
			throw new Error(`Failed to delete auction: ${error.message}`);
		}

		return NextResponse.json({ message: "Auction deleted successfully." }, { status: 200 });
	} catch (error) {
		console.error("[DELETE /api/auctions] Exception:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}

export async function PUT(req: Request) {
	try {
		const body: iAuction = await req.json();
		const {
			id,
			name,
			items_count,
			start_time,
			duration,
			re_open_count,
			description,
			created_by,
		} = body;

		console.log("body", body);

		const missingFields = [];
		if (!id) missingFields.push("id");
		if (!name) missingFields.push("name");
		if (!items_count) missingFields.push("items_count");
		if (!start_time) missingFields.push("start_time");
		if (!duration) missingFields.push("duration");
		if (!re_open_count) missingFields.push("re_open_count");
		if (!created_by) missingFields.push("created_by");

		if (missingFields.length > 0) {
			console.warn(
				`[PUT /api/auctions] Missing required fields: ${missingFields.join(
					", ",
				)}. Payload:`,
				body,
			);
			return NextResponse.json(
				{ error: `Missing required fields: ${missingFields.join(", ")}.` },
				{ status: 400 },
			);
		}

		const { data, error } = await supabase
			.from("auctions")
			.update({
				name,
				items_count,
				start_time,
				duration,
				re_open_count,
				description,
				created_by,
			})
			.eq("id", id)
			.select();

		if (error) {
			console.error("[PUT /api/auctions] Supabase error:", error.message);
			throw new Error(`Failed to update auction: ${error.message}`);
		}

		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("[PUT /api/auctions] Exception:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
