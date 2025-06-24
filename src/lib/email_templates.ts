/**
 * Generates a branded HTML email for contact form submissions.
 * @param params - The contact form fields.
 */
export function contactFormTemplate({
	name,
	email,
	message,
}: {
	name: string;
	email: string;
	message: string;
}) {
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Contact Form Submission</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<style>
			body {
				font-family: 'Segoe UI', Arial, sans-serif;
				background: #f6faff;
				color: #00132d;
				margin: 0;
				padding: 0;
			}
			.email-container {
				max-width: 600px;
				margin: 40px auto;
				background: #fff;
				border-radius: 12px;
				box-shadow: 0 4px 24px 0 rgba(1, 75, 139, 0.08);
				overflow: hidden;
				border: 1px solid #cbe0f6;
			}
			.header {
				background: linear-gradient(90deg, #014b8b 60%, #1976c5 100%);
				color: #e3f1fb;
				padding: 32px 24px 20px 24px;
				text-align: center;
			}
			.header img {
				width: 60px;
				margin-bottom: 10px;
			}
			.header h1 {
				margin: 0;
				font-size: 2rem;
				letter-spacing: -1px;
			}
			.content {
				padding: 32px 24px;
			}
			.content h2 {
				color: #014b8b;
				font-size: 1.25rem;
				margin-bottom: 16px;
			}
			.content p {
				margin: 8px 0;
				font-size: 1rem;
			}
			.label {
				font-weight: 600;
				color: #1976c5;
			}
			.footer {
				background: #eaf3fb;
				color: #4b6a8b;
				text-align: center;
				padding: 18px 24px;
				font-size: 0.95rem;
				border-top: 1px solid #cbe0f6;
			}
			.footer a {
				color: #014b8b;
				text-decoration: underline;
			}
			@media (max-width: 600px) {
				.email-container { margin: 0; border-radius: 0; }
				.header, .content, .footer { padding: 18px 8px; }
			}
		</style>
	</head>
	<body>
		<div class="email-container">
			<div class="header">
				<img src="https://udsbdddfarrckxeiupiv.supabase.co/storage/v1/object/public/amsa-public/images/amsa-logo.png" alt="Auction Market SA Logo" />
				<h1>Auction Market SA</h1>
				<div style="font-size:1.1rem; margin-top:8px;">Contact Form Submission</div>
			</div>
			<div class="content">
				<h2>You've received a new message:</h2>
				<p><span class="label">Name:</span> ${name}</p>
				<p><span class="label">Email:</span> ${email}</p>
				<p><span class="label">Message:</span></p>
				<p style="background:#f6faff; border-left:4px solid #1976c5; padding:12px 16px; border-radius:6px; color:#014b8b;">
					${message.replace(/\n/g, "<br/>")}
				</p>
			</div>
			<div class="footer">
				&copy; ${new Date().getFullYear()} Auction Market SA &mdash; <a href="https://auctionmarket.tech">auctionmarket.tech</a><br/>
				This is an automated message. For support, contact <a href="mailto:support@auctionmarket.tech">support@auctionmarket.tech</a>
			</div>
		</div>
	</body>
	</html>
	`;
}

/**
 * Generates a branded HTML email for user contact form submission confirmation.
 * @param params - The contact form fields.
 */
export function contactFormUserConfirmationTemplate({
	name,
	email,
	message,
}: {
	name: string;
	email: string;
	message: string;
}) {
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>We've Received Your Message!</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<style>
			body {
				font-family: 'Segoe UI', Arial, sans-serif;
				background: #f6faff;
				color: #00132d;
				margin: 0;
				padding: 0;
			}
			.email-container {
				max-width: 600px;
				margin: 40px auto;
				background: #fff;
				border-radius: 12px;
				box-shadow: 0 4px 24px 0 rgba(1, 75, 139, 0.08);
				overflow: hidden;
				border: 1px solid #cbe0f6;
			}
			.header {
				background: linear-gradient(90deg, #014b8b 60%, #1976c5 100%);
				color: #e3f1fb;
				padding: 32px 24px 20px 24px;
				text-align: center;
			}
			.header img {
				width: 60px;
				margin-bottom: 10px;
			}
			.header h1 {
				margin: 0;
				font-size: 2rem;
				letter-spacing: -1px;
			}
			.content {
				padding: 32px 24px;
			}
			.content h2 {
				color: #014b8b;
				font-size: 1.25rem;
				margin-bottom: 16px;
			}
			.content p {
				margin: 8px 0;
				font-size: 1rem;
			}
			.label {
				font-weight: 600;
				color: #1976c5;
			}
			.cta-btn {
				display: inline-block;
				margin: 24px 0 0 0;
				padding: 12px 32px;
				background: #014b8b;
				color: #fff;
				border-radius: 8px;
				font-size: 1.1rem;
				font-weight: 600;
				text-decoration: none;
				transition: background 0.2s;
			}
			.cta-btn:hover {
				background: #1976c5;
			}
			.support-box {
				background: #eaf3fb;
				border-radius: 8px;
				padding: 16px 20px;
				margin-top: 24px;
				color: #014b8b;
				font-size: 1rem;
			}
			.footer {
				background: #eaf3fb;
				color: #4b6a8b;
				text-align: center;
				padding: 18px 24px;
				font-size: 0.95rem;
				border-top: 1px solid #cbe0f6;
			}
			.footer a {
				color: #014b8b;
				text-decoration: underline;
			}
			@media (max-width: 600px) {
				.email-container { margin: 0; border-radius: 0; }
				.header, .content, .footer { padding: 18px 8px; }
			}
		</style>
	</head>
	<body>
		<div class="email-container">
			<div class="header">
				<img src="https://udsbdddfarrckxeiupiv.supabase.co/storage/v1/object/public/amsa-public/images/amsa-logo.png" alt="Auction Market SA Logo" />
				<h1>Auction Market SA</h1>
				<div style="font-size:1.1rem; margin-top:8px;">Thank You For Contacting Us!</div>
			</div>
			<div class="content">
				<h2>Hi${name ? ` ${name}` : ""}, we've received your message.</h2>
				<p>
					Thank you for reaching out to Auction Market SA. Our support team has received your message and will get back to you as soon as possible (usually within 2 business hours).
				</p>
    <br/>
				<p>
					<b>Your submission details:</b>
				</p>
				<p><span class="label">Name:</span> ${name}</p>
				<p><span class="label">Email:</span> ${email}</p>
				<p><span class="label">Message:</span></p>
				<p style="background:#f6faff; border-left:4px solid #1976c5; padding:12px 16px; border-radius:6px; color:#014b8b;">
					${message.replace(/\n/g, "<br/>")}
				</p>
				<a href="https://auctionmarket.tech/support/help-center" class="cta-btn">
					Visit Help Center
				</a>
				<div class="support-box">
					Need urgent help? Email us at <a href="mailto:support@auctionmarket.tech">support@auctionmarket.tech</a> or call +1 234 567 890.<br/>
					You can also join our <a href="https://auctionmarket.tech/community">community forum</a> for peer support and updates.
				</div>
			</div>
			<div class="footer">
				&copy; ${new Date().getFullYear()} Auction Market SA &mdash; <a href="https://auctionmarket.tech">auctionmarket.tech</a><br/>
				You are receiving this email because you submitted a contact request on our website.<br/>
				For more information, see our <a href="https://auctionmarket.tech/support/privacy">Privacy Policy</a>.
			</div>
		</div>
	</body>
	</html>
	`;
}
