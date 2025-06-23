import Container from "@/components/common/container";

export default function TermsPage() {
	return (
		<Container>
			<h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
			<p>
				Welcome to Action Market SA. By accessing or using our website, you agree to be
				bound by these Terms of Service. Please read them carefully.
			</p>
			<h2 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
			<p>
				By using our services, you agree to comply with and be legally bound by the terms
				and conditions of these Terms of Service.
			</p>
			<h2 className="text-xl font-semibold mt-6 mb-2">2. User Responsibilities</h2>
			<p>
				You are responsible for your use of the site, for any content you post, and for any
				consequences thereof.
			</p>
			<h2 className="text-xl font-semibold mt-6 mb-2">3. Auction Rules</h2>
			<p>
				All auctions are subject to our auction rules and policies. Please review them
				before participating.
			</p>
			<h2 className="text-xl font-semibold mt-6 mb-2">4. Limitation of Liability</h2>
			<p>
				We are not liable for any damages or losses resulting from your use of our services.
			</p>
			<h2 className="text-xl font-semibold mt-6 mb-2">5. Changes to Terms</h2>
			<p>
				We reserve the right to modify these Terms at any time. Continued use of the site
				constitutes acceptance of the new terms.
			</p>
			<p className="mt-8 text-muted-foreground">Last updated: June 2024</p>
		</Container>
	);
}
