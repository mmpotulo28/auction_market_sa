"use client";
import Container from "@/components/common/container";
import { Card } from "@/components/ui/card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageSquare, Star, Users } from "lucide-react";
import CustomerAd from "@/components/ads/CustomerAd";
import Link from "next/link";

const faqs = [
	{
		question: "How do I participate in an auction?",
		answer: "Sign up for an account, browse available auctions, and place your bids in real time. The highest bidder at the end wins the item.",
	},
	{
		question: "How do I list an item for auction?",
		answer: "After logging in, go to your account dashboard and select 'List Item'. Fill in the details and submit your item for review.",
	},
	{
		question: "How do I pay for an item I won?",
		answer: "After winning, go to your cart and proceed to checkout using our secure payment gateway.",
	},
	{
		question: "Who do I contact for support?",
		answer: "Use the Contact Us page to reach our support team, or email support@auctionmarket.tech.",
	},
];

export default function HelpCenterPage() {
	return (
		<Container>
			<div className="flex flex-col md:flex-row gap-8 mt-10">
				<div className="flex-1">
					<Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-accent/10 to-muted/60">
						<h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
							<HelpCircle className="text-accent" /> Help Center
						</h1>
						<p className="mb-6 text-muted-foreground">
							Find answers to common questions about using Auction Market SA.
						</p>
						<Accordion type="single" collapsible className="w-full">
							{faqs.map((faq, idx) => (
								<AccordionItem value={`faq-${idx}`} key={idx}>
									<AccordionTrigger>{faq.question}</AccordionTrigger>
									<AccordionContent>{faq.answer}</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
						<div className="mt-8 flex flex-col gap-4">
							<Card className="p-4 bg-muted/60 border-0 flex flex-col sm:flex-row items-center gap-3">
								<MessageSquare className="text-accent" />
								<span>
									Still have questions?{" "}
									<Link href="/support/contact" className="underline text-accent">
										Contact our team
									</Link>
								</span>
							</Card>
							<Card className="p-4 bg-muted/60 border-0 flex flex-col sm:flex-row items-center gap-3">
								<Users className="text-accent" />
								<span>
									Join our{" "}
									<a href="#" className="underline text-accent">
										community forum
									</a>{" "}
									for peer support.
								</span>
							</Card>
						</div>
					</Card>
				</div>
				<div className="w-full md:w-[340px] flex flex-col gap-6">
					<CustomerAd variant="card-small" />
					<Card className="p-6 bg-gradient-to-br from-primary/10 to-muted/40 border-0 shadow-lg">
						<h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
							<Star className="text-yellow-500" /> Top Tips
						</h2>
						<ul className="list-disc ml-5 text-muted-foreground text-sm space-y-1">
							<li>Verify your email for full access</li>
							<li>Set up notifications for auction reminders</li>
							<li>
								Read our{" "}
								<Link href="/support/terms" className="underline text-accent">
									Terms of Service
								</Link>
							</li>
						</ul>
					</Card>
					<Card className="p-6 bg-gradient-to-br from-accent/10 to-muted/30 border-0 shadow-lg">
						<h2 className="text-lg font-semibold mb-2">Quick Links</h2>
						<ul className="list-disc ml-5 text-muted-foreground text-sm space-y-1">
							<li>
								<Link href="/support/privacy" className="underline text-accent">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href="/support/terms" className="underline text-accent">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link href="/support/contact" className="underline text-accent">
									Contact Us
								</Link>
							</li>
						</ul>
					</Card>
				</div>
			</div>
		</Container>
	);
}
