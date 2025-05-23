import { NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function PUT(req: Request) {
	try {
		const items = await req.json();
		if (!Array.isArray(items) || items.length === 0) {
			return NextResponse.json({ error: "Invalid or empty items array." }, { status: 400 });
		}

		const errors: { itemId: string; error: string }[] = [];
		const results: { itemId: string; status: string }[] = [];

		for (const { itemId, status } of items) {
			if (!itemId || typeof status !== "string") {
				errors.push({ itemId: itemId ?? "unknown", error: "Missing itemId or status." });
				continue;
			}
			const { error } = await supabase.from("items").update({ status }).eq("id", itemId);

			if (error) {
				errors.push({ itemId, error: error.message });
			} else {
				results.push({ itemId, status });
			}
		}

		if (errors.length > 0) {
			return NextResponse.json({ updated: results, errors }, { status: 207 });
		}

		return NextResponse.json({ updated: results }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
