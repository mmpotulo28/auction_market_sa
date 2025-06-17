"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import styles from "./upcoming-auctions.module.css";
import LockUp from "../common/lockup";
import { iAuction, iTheme } from "@/lib/types";
import { Button } from "../ui/button";
import { stringToUrl, fetchAuctions } from "@/lib/helpers";
import { TimerContainer } from "../CountdownTimer";
import { toast } from "sonner";

const UpcomingAuctions: React.FC = () => {
	const router = useRouter();
	const [auctions, setAuctions] = React.useState<iAuction[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	useEffect(() => {
		fetchAuctions({
			setIsLoading,
			onLoad: (data: iAuction[]) => {
				toast.success("Fetched auctions successfully");
				setAuctions(data);
			},
			onError: (error: string) => {
				toast.error(`Failed to fetch auction: ${error}`);
				setError(error);
			},
		});
	}, []);

	if (error) return <div className={styles.error}>{error}</div>;

	return (
		<div className={styles.grid}>
			{isLoading && <div className={styles.loading}>Fetching Auctions</div>}
			{auctions?.map((auction, index: number) => (
				<div key={index} className={styles.card}>
					<div className={styles.cardHeader}>
						<LockUp title={auction.name} theme={iTheme.Dark} />
					</div>
					<div className={styles.cardContent}>
						<p className={styles.itemsCount}>Items Available: {auction.items_count}</p>
						<div className={styles.timer}>
							<TimerContainer targetDate={auction.start_time.toLocaleString()} />
						</div>
						<Button
							variant={"outline"}
							onClick={() => router.push(`/auction/${stringToUrl(auction.name)}`)}>
							Preview Auction
						</Button>
					</div>
				</div>
			))}
		</div>
	);
};

export default UpcomingAuctions;
