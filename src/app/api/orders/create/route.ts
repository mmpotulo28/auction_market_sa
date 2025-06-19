import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { iOrder, iAuctionItem, iOrderStatus } from "@/lib/types";
import { User } from "@clerk/nextjs/server";

interface CreateOrderRequest {
	items: iAuctionItem[];
	user: User;
	payment_id?: string;
	order_id?: string;
}

// POST: expects { items: [{id, name, price}], user: {id, email, firstName, lastName}, payment_id }
export async function POST(req: Request) {
	try {
		const { items, user, payment_id, order_id }: CreateOrderRequest = await req.json();
		if (!user?.id || !Array.isArray(items) || items.length === 0) {
			return NextResponse.json({ error: "Missing user or items." }, { status: 400 });
		}
		const rows: Omit<iOrder, "id" | "created_at" | "updated_at">[] = items.map((item) => ({
			order_id: order_id || "",
			user_id: user.id,
			item_id: item.id,
			item_name: item.title,
			price: item.price,
			payment_id: payment_id || "",
			order_status: iOrderStatus.Unpaid,
			user_email: user.primaryEmailAddress?.emailAddress || "",
			user_first_name: user.firstName || "",
			user_last_name: user.lastName || "",
			meta: {
				item_description: item.description || "",
				username: user.username || "",
			},
		}));
		const { data, error } = await supabaseAdmin.from("orders").insert(rows).select();

		if (error) {
			console.error("Order creation error:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		console.log("Order creation success:", data);
		return NextResponse.json({ orders: data as iOrder[] });
	} catch (err: any) {
		console.error("Unexpected order creation error:", err);
		return NextResponse.json(
			{ error: err?.message || "Order creation failed." },
			{ status: 500 },
		);
	}
}
