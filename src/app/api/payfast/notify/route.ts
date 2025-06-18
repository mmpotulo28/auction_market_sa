import { NextResponse } from "next/server";
import { storeTransaction, validatePayfastIPN } from "@/lib/payfast";
import { iTransaction } from "@/lib/types";

export async function POST(req: Request) {
	try {
		const body = await req.text();
		const params = Object.fromEntries(new URLSearchParams(body));

		const valid = await validatePayfastIPN(params);

		if (!valid) {
			console.error("Invalid PayFast IPN received", params);
			return NextResponse.json({ error: "Invalid PayFast IPN" }, { status: 400 });
		}

		await storeTransaction(params as unknown as iTransaction);

		return NextResponse.json({ status: "ok" });
	} catch (error: any) {
		console.error("PayFast notify error:", error);
		return NextResponse.json(
			{ error: error?.message || "Failed to process PayFast notification." },
			{ status: 500 },
		);
	}
}
