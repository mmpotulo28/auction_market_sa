import supabase, { supabaseAdmin } from "@/lib/db";

export interface AddItemData {
	id?: string;
	title: string;
	description: string;
	price: string;
	imageFile: File | null;
	category: string;
	condition: string;
	auctionId: string;
}

export async function addItemToDatabase(
	formData: AddItemData,
): Promise<{ success: boolean; error?: string }> {
	try {
		let imageUrl = "";

		// Upload image to Supabase storage
		if (formData.imageFile) {
			const { data, error: uploadError } = await supabaseAdmin.storage
				.from("amsa-public")
				.upload(`images/${Date.now()}-${formData.imageFile.name}`, formData.imageFile);

			if (uploadError) {
				throw new Error(
					`Failed to upload image to storage: ${uploadError.message}\n Caused by: ${uploadError.cause}`,
				);
			}

			imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/amsa-public/${data.path}`;
		}
		const { error: insertError } = await supabase.from("items").insert([
			{
				title: formData.title, // Matches character varying(255)
				description: formData.description, // Matches text
				price: parseFloat(formData.price).toFixed(2), // Matches numeric(10, 2)
				image: imageUrl, // Matches character varying(255)
				category: formData.category, // Matches character varying(255)
				condition: formData.condition, // Matches character varying(50)
				auction_id: parseInt(formData.auctionId, 10), // Matches integer
			},
		]);

		if (insertError) {
			// Delete image from storage if insertion fails
			if (imageUrl) {
				const { error: deleteError } = await supabase.storage
					.from("amsa-public")
					.remove([`images/${Date.now()}-${formData.imageFile?.name}`]);

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

		return { success: true, error: undefined };
	} catch (err) {
		console.error("(addItemsToDatabase):\n", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Unexpected error occurred.",
		};
	}
}
