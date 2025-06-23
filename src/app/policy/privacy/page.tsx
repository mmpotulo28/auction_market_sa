import Container from "@/components/common/container";

export default function PrivacyPolicyPage() {
	return (
		<Container>
			<h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
			<p>
				Your privacy is important to us. This Privacy Policy explains how we collect, use,
				and protect your personal information.
			</p>
			<h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
			<p>
				We collect information you provide directly to us, such as when you create an
				account, participate in auctions, or contact support.
			</p>
			<h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Information</h2>
			<p>
				We use your information to provide, maintain, and improve our services, and to
				communicate with you.
			</p>
			<h2 className="text-xl font-semibold mt-6 mb-2">3. Sharing of Information</h2>
			<p>
				We do not share your personal information with third parties except as necessary to
				provide our services or as required by law.
			</p>
			<h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h2>
			<p>We implement reasonable security measures to protect your information.</p>
			<h2 className="text-xl font-semibold mt-6 mb-2">5. Changes to This Policy</h2>
			<p>
				We may update this Privacy Policy from time to time. We encourage you to review it
				regularly.
			</p>
			<p className="mt-8 text-muted-foreground">Last updated: June 2024</p>
		</Container>
	);
}
