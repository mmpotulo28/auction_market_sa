import { NextRequest, NextResponse } from "next/server";
import supabase, { supabaseAdmin } from "@/lib/db";

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const auctionName = formData.get("auctionName") as string;
		const itemName = formData.get("itemName") as string;
		const itemDescription = formData.get("itemDescription") as string;
		const condition = formData.get("condition") as string;
		const requesterName = formData.get("requesterName") as string;
		const requesterEmail = formData.get("requesterEmail") as string;
		const requesterUserId = formData.get("requesterUserId") as string;
		const itemImages = formData.getAll("itemImages") as File[];

		const requiredFields = [auctionName, itemName, itemDescription, condition, requesterName, requesterEmail];
		if (requiredFields.some(field => !field)) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		const imageUrls: string[] = [];
		const uploadedImagePaths: string[] = [];

		const hasImages = itemImages && itemImages.length > 0;
		const firstImageHasSize = hasImages && itemImages[0].size > 0;
		if (hasImages && firstImageHasSize) {
			const uploadResults = await Promise.all(
				itemImages.map(async (imageFile: File, idx: number) => {
					const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1e6)}-${idx}`;
					const fileName = `item-requests/${uniqueSuffix}-${imageFile.name}`;
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

		const { error } = await supabase.from("auction_item_requests").insert([
			{
				auction_name: auctionName,
				item_name: itemName,
				item_description: itemDescription,
				item_images: imageUrls,
				condition,
				requester_name: requesterName,
				requester_email: requesterEmail,
				requester_user_id: requesterUserId,
			},
		]);

		if (error) {
			// Clean up uploaded images if DB insert fails
			if (uploadedImagePaths.length > 0) {
				await supabase.storage.from("amsa-public").remove(uploadedImagePaths);
			}
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (err) {
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : "Unexpected error" },
			{ status: 500 }
		);
	}
}
