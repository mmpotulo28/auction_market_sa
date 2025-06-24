"use client";
import Container from "@/components/common/container";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Send, MessageCircle, Users, Smile } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CustomerAd from "@/components/ads/CustomerAd";

export default function ContactPage() {
	const [form, setForm] = useState({ name: "", email: "", message: "" });
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setTimeout(() => {
			toast.success("Message sent! We'll get back to you soon.");
			setForm({ name: "", email: "", message: "" });
			setLoading(false);
		}, 1000);
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
								<Mail size={18} /> support@actionmarket.sa
							</div>
							<div className="flex items-center gap-2">
								<Phone size={18} /> +1 234 567 890
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
				</div>
			</div>
		</Container>
	);
}
