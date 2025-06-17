"use client";
import TopBanner from "@/components/TopBanner";
import { useRouter } from "next/navigation";
import UpcomingAuctions from "@/components/UpcomingAuctions";
import Container from "@/components/common/container";
import Banner from "@/components/Banner";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
	const router = useRouter();

	return (
		<div>
			<TopBanner
				overline="Welcome"
				title={"Auction Market SA"}
				subtitle="South Africa's Digital Marketplace Auction"
			/>

			<Container>
				<h1 className="text-4xl font-bold text-center my-8">Upcoming Auctions</h1>
				<UpcomingAuctions />
			</Container>

			<Container>
				<HowItWorks />
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
			/>
		</div>
	);
}
