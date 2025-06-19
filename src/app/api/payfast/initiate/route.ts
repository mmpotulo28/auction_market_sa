import { User } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID!;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY!;
// const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE!;
const PAYFAST_SANDBOX_URL = process.env.PAYFAST_SANDBOX_URL!;
const RETURN_URL = process.env.PAYFAST_RETURN_URL!;
const CANCEL_URL = process.env.PAYFAST_CANCEL_URL!;
const NOTIFY_URL = process.env.PAYFAST_NOTIFY_URL!;

export async function POST(req: Request) {
	try {
		const {
			items,
			user,
			m_payment_id,
			order_id,
		}: { items: any[]; user: User; m_payment_id?: string; order_id?: string } =
			await req.json();

		if (!items || !Array.isArray(items) || items.length === 0) {
			return NextResponse.json({ error: "No items to checkout." }, { status: 400 });
		}

		const total = items.reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2);

		// Use m_payment_id from frontend if provided
		const paymentId =
			m_payment_id || `amsa_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

		const firstItem = items[0];
		const pfData: Record<string, string> = {
			merchant_id: PAYFAST_MERCHANT_ID,
			merchant_key: PAYFAST_MERCHANT_KEY,
			return_url: RETURN_URL,
			cancel_url: CANCEL_URL,
			notify_url: NOTIFY_URL,
			amount: total,
			item_name: firstItem.name || "",
			item_description: firstItem.description || "",
			m_payment_id: paymentId,
			name_first: user?.firstName || "",
			name_last: user?.lastName || "",
			email_address: user?.primaryEmailAddress?.emailAddress || "",
			custom_str1: user?.id || user?.externalId || "",
			custom_str2: order_id || "",
			custom_str3: items.map((item) => item.id).join(", ") || "",
		};

		// Attach the first item's custom_str2 (order id) if present
		if (firstItem.custom_str2) {
			pfData.custom_str2 = firstItem.custom_str2;
		}

		const formInputs = Object.entries(pfData)
			.map(
				([key, val]) =>
					`<input type="hidden" name="${key}" value="${val.replace(/"/g, "&quot;")}" />`,
			)
			.join("\n");

		const html = `
			<html>
				<body onload="document.forms[0].submit()">
					<form action="${PAYFAST_SANDBOX_URL}" method="post">
						${formInputs}
						<!-- No signature field in sandbox mode -->
						<noscript>
							<input type="submit" value="Continue to PayFast" />
						</noscript>
					</form>
				</body>
			</html>
		`;

		return NextResponse.json({ formHtml: html, m_payment_id: paymentId });
	} catch (error: any) {
		console.error("PayFast initiate error:", error);
		return NextResponse.json(
			{ error: error?.message || "Failed to initiate PayFast payment." },
			{ status: 500 },
		);
	}
}
