"use client";
import Container from "@/components/common/container";
import { Card } from "@/components/ui/card";
import { Shield, Info } from "lucide-react";
import CustomerAd from "@/components/ads/CustomerAd";
import Link from "next/link";
import ShareApp from "@/components/Footer/ShareApp";

export default function PrivacyPolicyPage() {
	return (
		<Container>
			<div className="flex flex-col md:flex-row gap-8 mt-10">
				<div className="flex-1">
					<Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-accent/10 to-muted/60">
						<h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
							<Shield className="text-accent" /> Privacy Policy
						</h1>
						<p>
							Your privacy is important to us. This Privacy Policy explains how we
							collect, use, and protect your personal information.
						</p>
						<h2 className="text-xl font-semibold mt-6 mb-2">
							1. Information We Collect
						</h2>
						<p>
							We collect information you provide directly to us, such as when you
							create an account, participate in auctions, or contact support.
						</p>
						<h2 className="text-xl font-semibold mt-6 mb-2">
							2. How We Use Information
						</h2>
						<p>
							We use your information to provide, maintain, and improve our services,
							and to communicate with you.
						</p>
						<h2 className="text-xl font-semibold mt-6 mb-2">
							3. Sharing of Information
						</h2>
						<p>
							We do not share your personal information with third parties except as
							necessary to provide our services or as required by law.
						</p>
						<h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h2>
						<p>
							We implement reasonable security measures to protect your information.
						</p>
						<h2 className="text-xl font-semibold mt-6 mb-2">
							5. Changes to This Policy
						</h2>
						<p>
							We may update this Privacy Policy from time to time. We encourage you to
							review it regularly.
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
						<h2 className="text-lg font-semibold mb-2">Your Data, Your Rights</h2>
						<ul className="list-disc ml-5 text-muted-foreground text-sm space-y-1">
							<li>Request a copy of your data anytime</li>
							<li>Delete your account and data easily</li>
							<li>Contact us for privacy-related questions</li>
						</ul>
					</Card>
					<Card className="p-6 bg-gradient-to-br from-accent/10 to-muted/30 border-0 shadow-lg">
						<h2 className="text-lg font-semibold mb-2">Related Policies</h2>
						<ul className="list-disc ml-5 text-muted-foreground text-sm space-y-1">
							<li>
								<Link href="/support/terms" className="underline text-accent">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link href="/support/help-center" className="underline text-accent">
									Help Center
								</Link>
							</li>
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
