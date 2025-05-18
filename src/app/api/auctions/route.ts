import { NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function GET() {
	try {
		const { data, error } = await supabase
			.from("auctions")
			.select("*")
			.order("id", { ascending: false });

		if (error) {
			throw new Error(`Failed to fetch auctions: ${error.message}`);
		}

		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { name, items_count, start_time, duration, re_open_count, description, created_by } =
			body;

		if (!name || !items_count || !start_time || !duration || !re_open_count || !created_by) {
			return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
		}

		const { data, error } = await supabase.from("auctions").insert([
			{
				name,
				items_count,
				start_time,
				duration,
				re_open_count,
				description,
				created_by,
			},
		]);

		if (error) {
			throw new Error(`Failed to add auction: ${error.message}`);
		}

		return NextResponse.json(data, { status: 201 });
	} catch (error) {
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
			return NextResponse.json({ error: "Missing auction ID." }, { status: 400 });
		}

		const { error } = await supabase.from("auctions").delete().eq("id", id);

		if (error) {
			throw new Error(`Failed to delete auction: ${error.message}`);
		}

		return NextResponse.json({ message: "Auction deleted successfully." }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
