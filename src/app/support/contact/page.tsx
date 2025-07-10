"use client";
import Container from "@/components/common/container";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Send, MessageCircle, Users, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CustomerAd from "@/components/ads/CustomerAd";
import axios from "axios";
import { contactFormTemplate, contactFormUserConfirmationTemplate } from "@/lib/email_templates";
import * as Sentry from "@sentry/nextjs";
import { useUser } from "@clerk/nextjs";
import ShareApp from "@/components/Footer/ShareApp";

export default function ContactPage() {
	const { user } = useUser();
	const [form, setForm] = useState({
		name: user ? [user.firstName, user.lastName].filter(Boolean).join(" ") : "",
		email: user?.primaryEmailAddress?.emailAddress || "",
		message: "",
	});
	const [loading, setLoading] = useState(false);

	// Prefill form when user changes (e.g., after login)
	useEffect(() => {
		setForm((prev) => ({
			...prev,
			name: user ? [user.firstName, user.lastName].filter(Boolean).join(" ") : "",
			email: user?.primaryEmailAddress?.emailAddress || "",
		}));
	}, [user]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Send support email
			const { data } = await axios.post(
				"/api/email/send",
				{
					to: "mpotulom28@gmail.com",
					from: form.email,
					subject: `Contact Form: ${form.name}`,
					html: contactFormTemplate({
						name: form.name,
						email: form.email,
						message: form.message,
					}),
					text: `Name: ${form.name}\nEmail: ${form.email}\nMessage:\n${form.message}`,
				},
				{
					headers: {
						Authorization: `Bearer ${process.env.NEXT_PUBLIC_EMAIL_API_KEY || ""}`,
					},
				},
			);

			// Send user confirmation email (do not block UI on error)
			axios
				.post(
					"/api/email/send",
					{
						to: form.email,
						from: "support@auctionmarket.tech",
						subject: "We've received your message at Auction Market SA",
						html: contactFormUserConfirmationTemplate({
							name: form.name,
							email: form.email,
							message: form.message,
						}),
						text: `Hi ${form.name},\n\nThank you for contacting Auction Market SA. We have received your message and will get back to you soon.\n\nYour message:\n${form.message}\n\nBest regards,\nAuction Market SA Team`,
					},
					{
						headers: {
							Authorization: `Bearer ${process.env.NEXT_PUBLIC_EMAIL_API_KEY || ""}`,
						},
					},
				)
				.catch((err) => {
					Sentry.captureException(err);
					console.error("User confirmation email error:", err);
				});

			if (data.success) {
				toast.success("Message sent! We'll get back to you soon.");
				setForm({ name: "", email: "", message: "" });
			} else {
				Sentry.captureException(new Error(data.error || "Failed to send message."));
				console.error("Contact form error:", data.error || "Failed to send message.");
				toast.error(data.error || "Failed to send message.");
			}
		} catch (err: any) {
			Sentry.captureException(err);
			console.error("Contact form error:", err);
			toast.error(err?.response?.data?.error || err?.message || "Failed to send message.");
		}
		setLoading(false);
	};

	return (
		<Container>
			<div className="flex flex-col md:flex-row gap-8 mt-10">
				<div className="flex-1">
					<Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-accent/10 to-muted/60">
						<h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
							<Mail className="text-accent" /> Contact Us
						</h1>
						<p className="mb-6 text-muted-foreground">
							Have a question or need help? Fill out the form below and our team will
							respond as soon as possible.
						</p>
						<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
							<Input
								name="name"
								placeholder="Your Name"
								value={form.name}
								onChange={handleChange}
								required
							/>
							<Input
								name="email"
								type="email"
								placeholder="Your Email"
								value={form.email}
								onChange={handleChange}
								required
							/>
							<Textarea
								name="message"
								placeholder="Your Message"
								value={form.message}
								onChange={handleChange}
								rows={5}
								required
								style={{ minHeight: "200px" }}
							/>
							<Button type="submit" disabled={loading} className="w-fit self-end">
								{loading ? (
									"Sending..."
								) : (
									<>
										<Send className="mr-2" />
										Send Message
									</>
								)}
							</Button>
						</form>
						<div className="mt-8 space-y-2 text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<Mail size={18} /> support@auctionmarket.tech
							</div>
							<div className="flex items-center gap-2">
								<Phone size={18} /> +27 79 653 0453
							</div>
						</div>
						<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="flex items-center gap-3 bg-muted/60 rounded-lg p-3">
								<MessageCircle className="text-accent" />
								<span>Live chat available 9am-5pm</span>
							</div>
							<div className="flex items-center gap-3 bg-muted/60 rounded-lg p-3">
								<Users className="text-accent" />
								<span>Join our community forum</span>
							</div>
						</div>
						<div className="mt-6 flex items-center gap-2 text-green-700 font-medium">
							<Smile /> Our average response time:{" "}
							<span className="font-bold">2 hours</span>
						</div>
					</Card>
				</div>
				<div className="w-full md:w-[340px] flex flex-col gap-6">
					<CustomerAd variant="card-small" />
					<Card className="p-6 bg-gradient-to-br from-primary/10 to-muted/40 border-0 shadow-lg">
						<h2 className="text-lg font-semibold mb-2">Why Contact Us?</h2>
						<ul className="list-disc ml-5 text-muted-foreground text-sm space-y-1">
							<li>Get personalized support for your auctions</li>
							<li>Report issues or suggest new features</li>
							<li>Learn how to maximize your auction success</li>
						</ul>
					</Card>
					<Card className="p-6 bg-gradient-to-br from-accent/10 to-muted/30 border-0 shadow-lg">
						<h2 className="text-lg font-semibold mb-2">Popular Topics</h2>
						<ul className="list-disc ml-5 text-muted-foreground text-sm space-y-1">
							<li>How to list your first item</li>
							<li>Understanding bidding rules</li>
							<li>Payment and withdrawal options</li>
						</ul>
					</Card>
					<Card className="p-6 bg-gradient-to-br from-accent/10 to-muted/30 border-0 shadow-lg">
						<ShareApp />
					</Card>
				</div>
			</div>
		</Container>
	);
}
