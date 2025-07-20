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
	description: "A platform for purchasing items in realtime, auction.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" type="image/x-icon" href="/favicon.ico" />
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
							<main className="w-full h-full min-h-full mt-20">{children}</main>
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
