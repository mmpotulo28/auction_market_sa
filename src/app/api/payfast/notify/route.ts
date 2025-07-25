import { NextResponse } from "next/server";
import { storeTransaction, validatePayfastIPN } from "@/lib/payfast";
import { iTransaction } from "@/lib/types";
import { logger } from "@sentry/nextjs";

export async function POST(req: Request) {
	try {
		const body = await req.text();
		const params = Object.fromEntries(new URLSearchParams(body));

		logger.info("Received PayFast IPN:", { req });

		const valid = await validatePayfastIPN(params);

		if (!valid) {
			logger.error("Invalid PayFast IPN received", { params });
		}

		await storeTransaction(params as unknown as iTransaction);

		return NextResponse.json({ status: "ok" });
	} catch (error: any) {
		logger.error("PayFast notify error:", { error });
		return NextResponse.json(
			{ error: error?.message || "Failed to process PayFast notification." },
			{ status: 500 },
		);
	}
}
