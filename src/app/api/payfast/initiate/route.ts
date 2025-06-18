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
		const { items } = await req.json();

		if (!items || !Array.isArray(items) || items.length === 0) {
			return NextResponse.json({ error: "No items to checkout." }, { status: 400 });
		}

		const total = items.reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2);

		const m_payment_id = `amsa_${Date.now()}`;
		const pfData: Record<string, string> = {
			merchant_id: PAYFAST_MERCHANT_ID,
			merchant_key: PAYFAST_MERCHANT_KEY,
			return_url: RETURN_URL,
			cancel_url: CANCEL_URL,
			notify_url: NOTIFY_URL,
			amount: total,
			item_name: items
				.map((i) => i.name)
				.join(", ")
				.slice(0, 100),
			item_description: items
				.map((i) => i.description)
				.join("; ")
				.slice(0, 255),
			m_payment_id,
		};

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

		return NextResponse.json({ formHtml: html, m_payment_id });
	} catch (error: any) {
		console.error("PayFast initiate error:", error);
		return NextResponse.json(
			{ error: error?.message || "Failed to initiate PayFast payment." },
			{ status: 500 },
		);
	}
}
