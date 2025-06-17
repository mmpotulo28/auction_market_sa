import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import styles from "./how.module.css";
import { PlayCircleIcon } from "lucide-react";
import Container from "../common/container";

const HowItWorks: React.FC = () => {
	return (
		<div className={styles.howItWorks}>
			<Container className={styles.howItWorksContainer}>
				<div className={styles.howItWorksGrid}>
					<h2 className="text-3xl font-bold text-center">How It Works</h2>
					<div className={styles.step}>
						<div className={styles.stepNumber}>1</div>
						<Card className={styles.card}>
							<CardHeader>
								<CardTitle>Create an Account</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									Sign up to start listing items or participating in auctions.
									It&apos;s quick and easy!
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Step 2 */}
					<div className={styles.step}>
						<div className={styles.stepNumber}>2</div>
						<Card className={styles.card}>
							<CardHeader>
								<CardTitle>List or Browse Items</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									List your items for auction or browse through a variety of
									categories to find what you need.
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Step 3 */}
					<div className={styles.step}>
						<div className={styles.stepNumber}>3</div>
						<Card className={styles.card}>
							<CardHeader>
								<CardTitle>Place Bids</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									Participate in auctions by placing bids on items you like. The
									highest bidder wins!
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
				<div className={styles.tutorialVideo}>
					<Image
						src="/images/781c714b-26ca-4e22-8850-af2a12caabb0.jpeg"
						alt="How It Works Tutorial"
						title="How It Works Tutorial"
						className={styles.video}
						width={400}
						height={600}></Image>
					<div className={styles.overlay}>
						<PlayCircleIcon size={80} className={styles.playIcon} />
					</div>
				</div>
			</Container>
		</div>
	);
};

export default HowItWorks;
