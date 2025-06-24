import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import nodemailer from "nodemailer";

// Environment variables for security
const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

export async function POST(req: NextRequest) {
	const authHeader = req.headers.get("authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const apiKey = authHeader.replace("Bearer ", "").trim();
	if (!EMAIL_API_KEY || apiKey !== EMAIL_API_KEY) {
		return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
	}

	try {
		const { to, from, subject, html, text } = await req.json();

		if (!to || !from || !subject || !html) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		if (!GMAIL_USER || !GMAIL_PASS) {
			return NextResponse.json({ error: "Email server not configured" }, { status: 500 });
		}

		// Nodemailer transporter using Gmail SMTP
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: GMAIL_USER,
				pass: GMAIL_PASS,
			},
		});

		// Send the email
		const mailOptions = {
			from: `"Auction Market SA" <${GMAIL_USER}>`,
			replyTo: from,
			to,
			subject,
			text: text || "",
			html,
		};

		const info = await transporter.sendMail(mailOptions);

		// Store email in DB
		const { error } = await supabaseAdmin.from("emails").insert([
			{
				from_email: from,
				to_email: to,
				subject,
				body: html,
				status: info.accepted && info.accepted.length > 0 ? "SENT" : "FAILED",
				date_sent: new Date().toISOString(),
			},
		]);
		if (error) {
			console.error("Failed to store email:", error);
			return NextResponse.json({ error: "Failed to store email" }, { status: 500 });
		}

		return NextResponse.json({ success: true, messageId: info.messageId });
	} catch (err: any) {
		console.error("Email send error:", err);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
