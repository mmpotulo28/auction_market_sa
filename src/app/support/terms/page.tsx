"use client";
import Container from "@/components/common/container";
import { Card } from "@/components/ui/card";
import { FileText, Info } from "lucide-react";
import CustomerAd from "@/components/ads/CustomerAd";
import Link from "next/link";

export default function TermsPage() {
	return (
		<Container>
			<div className="flex flex-col md:flex-row gap-8 mt-10">
				<div className="flex-1">
					<Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-accent/10 to-muted/60">
						<h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
							<FileText className="text-accent" /> Terms of Service
						</h1>
						<p>
							Welcome to Auction Market SA. By accessing or using our website, you
							agree to be bound by these Terms of Service. Please read them carefully.
						</p>
						<h2 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
						<p>
							By using our services, you agree to comply with and be legally bound by
							the terms and conditions of these Terms of Service.
						</p>
						<h2 className="text-xl font-semibold mt-6 mb-2">
							2. User Responsibilities
						</h2>
						<p>
							You are responsible for your use of the site, for any content you post,
							and for any consequences thereof.
						</p>
						<h2 className="text-xl font-semibold mt-6 mb-2">3. Auction Rules</h2>
						<p>
							All auctions are subject to our auction rules and policies. Please
							review them before participating.
						</p>
						<h2 className="text-xl font-semibold mt-6 mb-2">
							4. Limitation of Liability
						</h2>
						<p>
							We are not liable for any damages or losses resulting from your use of
							our services.
						</p>
						<h2 className="text-xl font-semibold mt-6 mb-2">5. Changes to Terms</h2>
						<p>
							We reserve the right to modify these Terms at any time. Continued use of
							the site constitutes acceptance of the new terms.
						</p>
						<p className="mt-8 text-muted-foreground">Last updated: June 2024</p>
						<Card className="mt-8 p-4 bg-muted/60 border-0 flex items-center gap-3">
							<Info className="text-accent" />
							<span>
								Questions?{" "}
								<Link href="/support/contact" className="underline text-accent">
									Contact support
								</Link>
							</span>
						</Card>
					</Card>
				</div>
				<div className="w-full md:w-[340px] flex flex-col gap-6">
					<CustomerAd variant="card-small" />
					<Card className="p-6 bg-gradient-to-br from-primary/10 to-muted/40 border-0 shadow-lg">
						<h2 className="text-lg font-semibold mb-2">Why Read Our Terms?</h2>
						<ul className="list-disc ml-5 text-muted-foreground text-sm space-y-1">
							<li>Understand your rights and responsibilities</li>
							<li>Learn about safe bidding practices</li>
							<li>Know how disputes are handled</li>
						</ul>
					</Card>
					<Card className="p-6 bg-gradient-to-br from-accent/10 to-muted/30 border-0 shadow-lg">
						<h2 className="text-lg font-semibold mb-2">Related Policies</h2>
						<ul className="list-disc ml-5 text-muted-foreground text-sm space-y-1">
							<li>
								<Link href="/support/privacy" className="underline text-accent">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href="/support/help-center" className="underline text-accent">
									Help Center
								</Link>
							</li>
						</ul>
					</Card>
				</div>
			</div>
		</Container>
	);
}
