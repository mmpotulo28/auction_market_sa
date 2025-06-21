"use client";
import TopBanner from "@/components/TopBanner";
import { useRouter } from "next/navigation";
import UpcomingAuctions from "@/components/UpcomingAuctions";
import Container from "@/components/common/container";
import Banner from "@/components/Banner";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import { ArrowRightIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { iSize } from "@/lib/types";
import CustomerAd from "@/components/ads/CustomerAd";

export default function Home() {
	const router = useRouter();

	return (
		<div>
			<TopBanner
				overline="Welcome"
				title={"Auction Market SA"}
				subtitle="South Africa's Digital Marketplace Auction"
				action={{
					label: "Get Started",
					click: () => router.push("#upcoming-auctions"),
					iconEnd: <ArrowRightIcon />,
				}}
			/>

			<Container>
				<h1 className="text-4xl font-bold text-center my-8" id="upcoming-auctions">
					Upcoming Auctions
				</h1>
				<UpcomingAuctions />
				<Separator className="my-3" />
				<CustomerAd variant="banner" />
				<Separator className="my-3" />
			</Container>

			<Container fullWidth padded={false}>
				<HowItWorks />
			</Container>

			<Container>
				<Features />
				<Separator className="my-3" />
			</Container>

			<Banner
				title={"Welcome to the Auction!"}
				content={"Join us for exciting auctions and great deals!"}
				image={{
					src: "939eb999-8f08-4661-a8fa-df7872e95077.jpeg",
					alt: "Auction Image",
				}}
				actions={[
					{
						label: "View All Listings",
						click: () => router.push("/auction?cat=all"),
					},
				]}
				size={iSize.Medium}
			/>
		</div>
	);
}
