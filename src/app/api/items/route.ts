import { NextRequest, NextResponse } from "next/server";
import supabase, { supabaseAdmin } from "@/lib/db";
import { logger } from "@sentry/nextjs";
import { AddItemData } from "@/lib/dbFunctions";

// GET: Fetch all items
export async function GET() {
	try {
		logger.info("[api/items] Fetching items...");
		const { data, error } = await supabase.from("items").select("*");
		if (error) throw error;
		return NextResponse.json({ items: data ?? [] }, { status: 200 });
	} catch (error) {
		logger.error("[api/items] Error fetching items:", { error });
		const errorMessage = error instanceof Error ? error.message : String(error);
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}

// POST: Create a new item
export async function POST(req: Request) {
	try {
		let imageUrl = "";

		const body = await req.json();

		console.log("[api/items] Creating item:", body);
		const { item }: { item: AddItemData } = body;

		// Upload image to Supabase storage
		if (item.imageFile) {
			const { data, error: uploadError } = await supabaseAdmin.storage
				.from("amsa-public")
				.upload(`images/${Date.now()}-${item.imageFile.name}`, item.imageFile);

			if (uploadError) {
				throw new Error(
					`Failed to upload image to storage: ${uploadError.message}\n Caused by: ${uploadError.cause}`,
				);
			}

			imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/amsa-public/${data.path}`;
		}

		const { error: insertError } = await supabase.from("items").insert([
			{
				title: item.title,
				description: item.description,
				price: parseFloat(item.price).toFixed(2),
				image: imageUrl,
				category: item.category,
				condition: item.condition,
				auction_id: parseInt(item.auctionId, 10),
			},
		]);

		if (insertError) {
			// Delete image from storage if insertion fails
			if (imageUrl) {
				const { error: deleteError } = await supabase.storage
					.from("amsa-public")
					.remove([`images/${Date.now()}-${item.imageFile?.name}`]);

				if (deleteError) {
					console.error(
						`Failed to delete image from storage after insert error: ${deleteError.message}`,
					);
				}
			}

			throw new Error(
				`Failed to insert item to db: ${insertError.message}\n Details: ${insertError.details}`,
			);
		}

		return NextResponse.json({ success: true, error: undefined }, { status: 200 });
	} catch (err) {
		console.error("(addItemsToDatabase):\n", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Unexpected error occurred.",
			},
			{ status: 500 },
		);
	}
}

// PUT: Update an item
export async function PUT(req: NextRequest) {
	try {
		const body = await req.json();
		const { id, ...fields } = body;
		if (!id) {
			return NextResponse.json({ error: "Missing item id" }, { status: 400 });
		}
		const { data, error } = await supabase.from("items").update(fields).eq("id", id).select();

		if (error) {
			logger.error("[PUT /api/items] Supabase error:", { error });
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ item: data?.[0] }, { status: 200 });
	} catch (error) {
		logger.error("[PUT /api/items] Error updating item:", { error });
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}

// DELETE: Delete an item
export async function DELETE(req: NextRequest) {
	try {
		const { id } = await req.json();
		if (!id) {
			return NextResponse.json({ error: "Missing item id" }, { status: 400 });
		}
		const { error } = await supabase.from("items").delete().eq("id", id);
		if (error) {
			logger.error("[DELETE /api/items] Supabase error:", { error });
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		logger.error("[DELETE /api/items] Error deleting item:", { error });
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
