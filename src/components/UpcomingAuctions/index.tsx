"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./upcoming-auctions.module.css";
import LockUp from "../common/lockup";
import { iAuction, iTheme } from "@/lib/types";
import { Button } from "../ui/button";
import { Switch } from "@/components/ui/switch";
import { stringToUrl, fetchAuctions } from "@/lib/helpers";
import { TimerContainer } from "../CountdownTimer";
import { toast } from "sonner";
import Illustration from "../Illustration";

const UpcomingAuctions: React.FC = () => {
	const router = useRouter();
	const [auctions, setAuctions] = React.useState<iAuction[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [showOld, setShowOld] = React.useState(false);

	useEffect(() => {
		fetchAuctions({
			setIsLoading,
			onLoad: (data: iAuction[]) => {
				toast.success("Fetched auctions successfully");
				console.log("auctions:", data);
				setAuctions(data);
			},
			onError: (error: string) => {
				toast.error(`Failed to fetch auction: ${error}`);
				setError(error);
			},
		});
	}, []);

	if (error) return <div className={styles.error}>{error}</div>;

	const now = Date.now();
	let filteredAuctions = auctions;
	if (!showOld) {
		filteredAuctions = auctions.filter((auction) => {
			const start = new Date(auction.start_time).getTime();
			return now < start;
		});
	}

	return (
		<>
			<div className="flex justify-end items-center px-6 pt-2 gap-2">
				<label htmlFor="show-old-auctions" className="text-sm text-muted-foreground">
					Show Old Auctions
				</label>
				<Switch id="show-old-auctions" checked={showOld} onCheckedChange={setShowOld} />
			</div>
			<div className={styles.grid}>
				{isLoading && (
					<div className={styles.loading}>
						<Illustration type="loading" className="mx-auto my-5" />
					</div>
				)}
				{filteredAuctions?.map((auction, index: number) => (
					<div key={index} className={styles.card}>
						<div className={styles.cardHeader}>
							<LockUp title={auction.name} theme={iTheme.Dark} />
						</div>
						<div className={styles.cardContent}>
							<p className={styles.itemsCount}>
								Items Available: {auction.items_count}
							</p>
							<div className={styles.timer}>
								<TimerContainer targetDate={auction.start_time.toLocaleString()} />
							</div>
							<Button
								variant={"outline"}
								onClick={() =>
									router.push(`/auction/${stringToUrl(auction.name)}`)
								}>
								Preview Auction
							</Button>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default UpcomingAuctions;
