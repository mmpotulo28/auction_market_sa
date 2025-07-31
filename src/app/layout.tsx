import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { WebSocketProvider } from "@/context/WebSocketProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import Script from "next/script";

export const metadata: Metadata = {
	title: "Auction Market SA",
	description:
		"Auction Market SA is South Africa’s most innovative digital auction platform. Buy and sell items in real-time, secure, and modern online auctions. Empowering local communities and businesses.",
	keywords: [
		"auction",
		"marketplace",
		"South Africa",
		"bidding",
		"buy online",
		"sell online",
		"real-time auctions",
		"auction platform",
		"auction market sa",
		"online auction",
		"bid",
		"collectibles",
		"property auction",
		"vehicle auction",
		"secure payment",
		"PayFast",
		"Supabase",
		"Clerk.dev",
		"modern web",
	],
	metadataBase: new URL("https://auctionmarket.tech"),
	applicationName: "Auction Market SA",
	authors: [{ name: "Auction Market SA", url: "https://auctionmarket.tech" }],
	creator: "Auction Market SA",
	publisher: "Auction Market SA",
	openGraph: {
		title: "Auction Market SA",
		description:
			"South Africa’s most innovative digital auction platform. Buy and sell items in real-time, secure, and modern online auctions.",
		url: "https://auctionmarket.tech",
		siteName: "Auction Market SA",
		images: [
			{
				url: "/images/amsa-logo.png",
				width: 512,
				height: 512,
				alt: "Auction Market SA Logo",
			},
		],
		locale: "en_ZA",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Auction Market SA",
		description:
			"South Africa’s most innovative digital auction platform. Buy and sell items in real-time, secure, and modern online auctions.",
		images: ["/images/amsa-logo.png"],
		site: "@auctionmarketsa",
		creator: "@auctionmarketsa",
	},
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
		apple: "/apple-touch-icon.png",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export const viewport = {
	themeColor: "#014b8b",
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	minimumScale: 1,
	userScalable: true,
	viewportFit: "cover",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en-ZA">
			<head>
				<link rel="icon" type="image/x-icon" href="/favicon.ico" />
				<link rel="canonical" href="https://auctionmarket.tech" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="author" content="Auction Market SA" />
				<meta
					name="keywords"
					content="auction, marketplace, South Africa, bidding, buy online, sell online, real-time auctions, auction platform, auction market sa, online auction, bid, collectibles, property auction, vehicle auction, secure payment, PayFast, Supabase, Clerk.dev, modern web"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:locale" content="en_ZA" />
				<meta property="og:site_name" content="Auction Market SA" />
				<meta property="og:title" content="Auction Market SA" />
				<meta
					property="og:description"
					content="South Africa’s most innovative digital auction platform. Buy and sell items in real-time, secure, and modern online auctions."
				/>
				<meta property="og:url" content="https://auctionmarket.tech" />
				<meta property="og:image" content="/images/amsa-logo.png" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Auction Market SA" />
				<meta
					name="twitter:description"
					content="South Africa’s most innovative digital auction platform. Buy and sell items in real-time, secure, and modern online auctions."
				/>
				<meta name="twitter:image" content="/images/amsa-logo.png" />
				<meta name="twitter:site" content="@auctionmarketsa" />
				<meta name="twitter:creator" content="@auctionmarketsa" />
				{/* <link rel="preload" href="/fonts/your-font.woff2" as="font" type="font/woff2" crossorigin="anonymous" /> */}
				<Script
					id="newrelic-script"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{
						__html: `
;window.NREUM||(NREUM={});NREUM.init={session_replay:{enabled:true,block_selector:'',mask_text_selector:'*',sampling_rate:10.0,error_sampling_rate:100.0,mask_all_inputs:true,collect_fonts:true,inline_images:false,inline_stylesheet:true,fix_stylesheets:true,preload:false,mask_input_options:{}},distributed_tracing:{enabled:true},privacy:{cookies_enabled:true},ajax:{deny_list:["bam.nr-data.net"]}};
;NREUM.loader_config={accountID:"6853570",trustKey:"6853570",agentID:"1134597126",licenseKey:"NRJS-0d9d426de3b1f4e3c9f",applicationID:"1134597126"};
;NREUM.info={beacon:"bam.nr-data.net",errorBeacon:"bam.nr-data.net",licenseKey:"NRJS-0d9d426de3b1f4e3c9f",applicationID:"1134597126",sa:1};
`,
					}}
				/>
				<Script
					id="jsonld-org"
					type="application/ld+json"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							name: "Auction Market SA",
							url: "https://auctionmarket.tech",
							logo: "https://auctionmarket.tech/images/amsa-logo.png",
							contactPoint: [
								{
									"@type": "ContactPoint",
									email: "support@auctionmarket.tech",
									telephone: "+27 79 653 0453",
									contactType: "customer support",
									areaServed: "ZA",
									availableLanguage: ["en"],
								},
							],
							sameAs: ["https://twitter.com/auctionmarketsa"],
							description:
								"Auction Market SA is South Africa’s most innovative digital auction platform. Buy and sell items in real-time, secure, and modern online auctions. Empowering local communities and businesses.",
						}),
					}}
				/>
			</head>
			<body className={`antialiased`}>
				<Script src="//code.tidio.co/ohxu3aax2hizek3hbmbg9m3ivxwffjts.js" async />
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<ClerkProvider
						appearance={{
							layout: {
								socialButtonsPlacement: "top",
								socialButtonsVariant: "auto",
								logoPlacement: "none",
								shimmer: true,
							},
							captcha: {
								theme: "auto",
								size: "flexible",
							},
						}}>
						<WebSocketProvider>
							<Header />
							<main className="w-full h-full min-h-full mt-0">{children}</main>
							<Toaster
								position="top-right"
								closeButton
								expand
								richColors
								theme="system"
							/>
							<Footer />
						</WebSocketProvider>
					</ClerkProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
