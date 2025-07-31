import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import { logger } from "@sentry/nextjs";
import { deleteImages, parseFormData, uploadImages } from "@/lib/helpers";

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
export async function POST(req: NextRequest) {
	try {
		let uploadedImagePaths: string[] = [];

		const { fields, imageFiles } = await parseFormData(req);

		const isMissingFields =
			!fields.title ||
			!fields.description ||
			!fields.price ||
			!fields.category ||
			!fields.condition;
		if (isMissingFields) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		const imageFilesProvided = imageFiles && imageFiles.length > 0 && imageFiles[0].size > 0;
		if (imageFilesProvided) {
			const { urls, paths } = await uploadImages(imageFiles);
			fields.image = urls;
			uploadedImagePaths = paths;
		}

		const { error: insertError } = await supabase.from("items").insert([
			{
				title: fields.title,
				description: fields.description,
				price: parseFloat(fields.price).toFixed(2),
				image: fields.image,
				category: fields.category,
				condition: fields.condition,
				auction_id: fields.auctionId,
			},
		]);

		if (insertError) {
			if (uploadedImagePaths.length > 0) {
				const { error: deleteError } = await deleteImages(uploadedImagePaths);

				if (deleteError) {
					console.error(
						`Failed to delete images from storage after insert error: ${deleteError}`,
					);
				} else {
					console.log(
						"Images deleted successfully after insert error.",
						uploadedImagePaths,
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
		const contentType = req.headers.get("content-type") || "";
		let id: string | number | undefined;
		let fields: any = {};
		let uploadedImagePaths: string[] = [];

		if (contentType.includes("multipart/form-data")) {
			const { id: formId, fields: formFields, imageFiles } = await parseFormData(req);
			id = formId;
			fields = formFields;

			const imageFilesProvided =
				imageFiles && imageFiles.length > 0 && imageFiles[0].size > 0;

			if (imageFilesProvided) {
				const { urls, paths } = await uploadImages(imageFiles);
				fields.image = urls;
				uploadedImagePaths = paths;
			}
		} else {
			const body = await req.json();
			id = body.id;
			fields = { ...body };
			delete fields.id;
		}

		if (!id) {
			return NextResponse.json({ error: "Missing item id" }, { status: 400 });
		}

		const { data, error } = await supabase.from("items").update(fields).eq("id", id).select();

		if (error) {
			await deleteImages(uploadedImagePaths);
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
