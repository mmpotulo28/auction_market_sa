"use client";
import TopBanner from "@/components/TopBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import UpcomingAuctions from "@/components/UpcomingAuctions";
import Container from "@/components/common/container";
import styles from "./page.module.css";
import Banner from "@/components/Banner";

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
				<h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
				<div className={styles.howItWorksGrid}>
					{/* Step 1 */}
					<div className={styles.step}>
						<div className={styles.stepNumber}>1</div>
						<Card>
							<CardHeader>
								<CardTitle>Create an Account</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									Sign up to start listing items or participating in auctions.
									It&apos;s quick and easy!
								</p>
								<Button
									variant="link"
									className="mt-4"
									onClick={() =>
										router.push(
											"/auth?type=signup?after_auth_return_to=/auction",
										)
									}>
									Sign Up <ChevronRight className="ml-2 h-4 w-4" />
								</Button>
							</CardContent>
						</Card>
					</div>

					{/* Step 2 */}
					<div className={styles.step}>
						<div className={styles.stepNumber}>2</div>
						<Card>
							<CardHeader>
								<CardTitle>List or Browse Items</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									List your items for auction or browse through a variety of
									categories to find what you need.
								</p>
								<Button
									variant="default"
									className="mt-4"
									onClick={() => router.push("/auction")}>
									Browse Items
								</Button>
							</CardContent>
						</Card>
					</div>

					{/* Step 3 */}
					<div className={styles.step}>
						<div className={styles.stepNumber}>3</div>
						<Card>
							<CardHeader>
								<CardTitle>Place Bids</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									Participate in auctions by placing bids on items you like. The
									highest bidder wins!
								</p>
								<Button
									variant="default"
									className="mt-4"
									onClick={() => router.push("/auction")}>
									Start Bidding
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
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
