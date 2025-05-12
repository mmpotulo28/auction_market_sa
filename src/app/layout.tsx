import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { WebSocketProvider } from "@/context/WebSocketProvider";
import { dark } from "@clerk/themes";

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
			<body className={`antialiased`}>
				<ClerkProvider
					appearance={{
						baseTheme: dark,
					}}>
					<WebSocketProvider>
						<Header />
						<main>{children}</main>
						<Toaster />
						<Footer />
					</WebSocketProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
