import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { WebSocketProvider } from "@/context/WebSocketProvider";
import { ThemeProvider } from "@/context/ThemeProvider";

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
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<ClerkProvider>
						<WebSocketProvider>
							<Header />
							<main className="w-full h-full min-h-full">{children}</main>
							<Toaster />
							<Footer />
						</WebSocketProvider>
					</ClerkProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
