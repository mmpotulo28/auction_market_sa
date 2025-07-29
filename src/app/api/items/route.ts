import { NextRequest, NextResponse } from "next/server";
import supabase, { supabaseAdmin } from "@/lib/db";
import { logger } from "@sentry/nextjs";

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
		const formData = await req.formData();
		const title = (formData.get("title") as string) || "";
		const description = (formData.get("description") as string) || "";
		const priceRaw = formData.get("price");
		const price = typeof priceRaw === "string" && priceRaw !== "" ? priceRaw : "0";
		const category = (formData.get("category") as string) || "";
		const condition = (formData.get("condition") as string) || "";
		const auctionIdRaw = formData.get("auctionId");
		const auctionId =
			typeof auctionIdRaw === "string" && auctionIdRaw !== "" && !isNaN(Number(auctionIdRaw))
				? parseInt(auctionIdRaw, 10)
				: null;
		const imageFiles = formData.getAll("imageFiles") as File[];

		// Validate required fields
		if (!title || !description || !category || !condition || !auctionId) {
			console.log("[api/items] Missing required fields", formData);
			return NextResponse.json(
				{ success: false, error: "Missing required fields." },
				{ status: 400 },
			);
		}

		const imageUrls: string[] = [];
		const uploadedImagePaths: string[] = [];

		if (imageFiles && imageFiles.length > 0) {
			const uploadResults = await Promise.all(
				imageFiles.map(async (imageFile: File, idx: number) => {
					const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1e6)}-${idx}`;
					const fileName = `images/${uniqueSuffix}-${imageFile.name}`;
					const { data, error: uploadError } = await supabaseAdmin.storage
						.from("amsa-public")
						.upload(fileName, imageFile);

					if (uploadError) {
						throw new Error(
							`Failed to upload image to storage: ${uploadError.message}\n Caused by: ${uploadError.cause}`,
						);
					}

					return {
						url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/amsa-public/${data.path}`,
						path: data.path,
					};
				}),
			);

			for (const result of uploadResults) {
				imageUrls.push(result.url);
				uploadedImagePaths.push(result.path);
			}
		}

		const { error: insertError } = await supabase.from("items").insert([
			{
				title,
				description,
				price: parseFloat(price).toFixed(2),
				image: imageUrls,
				category,
				condition,
				auction_id: auctionId,
			},
		]);

		if (insertError) {
			if (uploadedImagePaths.length > 0) {
				const { error: deleteError } = await supabase.storage
					.from("amsa-public")
					.remove(uploadedImagePaths);

				if (deleteError) {
					console.error(
						`Failed to delete images from storage after insert error: ${deleteError.message}`,
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
		let imageFiles: File[] = [];
		const uploadedImagePaths: string[] = [];
		const imageUrls: string[] = [];

		if (contentType.includes("multipart/form-data")) {
			const formData = await req.formData();
			id = formData.get("id") as string;
			fields.title = (formData.get("title") as string) || "";
			fields.description = (formData.get("description") as string) || "";
			fields.price = (formData.get("price") as string) || "0";
			fields.category = (formData.get("category") as string) || "";
			fields.condition = (formData.get("condition") as string) || "";
			fields.auction_id = formData.get("auctionId") || null;
			imageFiles = formData.getAll("imageFiles") as File[];

			// Only upload new images if provided
			const imageFilesProvided =
				imageFiles && imageFiles.length > 0 && imageFiles[0].size > 0;

			if (imageFilesProvided) {
				const uploadResults = await Promise.all(
					imageFiles.map(async (imageFile: File, idx: number) => {
						const uniqueSuffix = `${Date.now()}-${Math.floor(
							Math.random() * 1e6,
						)}-${idx}`;
						const fileName = `images/${uniqueSuffix}-${imageFile.name}`;
						const { data, error: uploadError } = await supabaseAdmin.storage
							.from("amsa-public")
							.upload(fileName, imageFile);

						if (uploadError) {
							throw new Error(
								`Failed to upload image to storage: ${uploadError.message}\n Caused by: ${uploadError.cause}`,
							);
						}

						return {
							url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/amsa-public/${data.path}`,
							path: data.path,
						};
					}),
				);

				for (const result of uploadResults) {
					imageUrls.push(result.url);
					uploadedImagePaths.push(result.path);
				}
				fields.image = imageUrls;
			}

			// If no new images, don't update the image field
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
			// Clean up uploaded images if update fails
			if (uploadedImagePaths.length > 0) {
				const { error: deleteError } = await supabase.storage
					.from("amsa-public")
					.remove(uploadedImagePaths);

				if (deleteError) {
					console.error(
						`Failed to delete images from storage after update error: ${deleteError.message}`,
					);
				}
			}
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
