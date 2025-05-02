"use client";

import React from "react";
import { useRouter } from "next/navigation";
import CountdownTimer from "@/components/CountdownTimer";
import styles from "./upcoming-auctions.module.css";
import LockUp from "../common/lockup";
import { iAuction, iTheme } from "@/lib/types";
import { Button } from "../ui/button";

interface UpcomingAuctionsProps {
	auctions: iAuction[];
}

const UpcomingAuctions: React.FC<UpcomingAuctionsProps> = ({ auctions }) => {
	const router = useRouter();

	return (
		<div className={styles.grid}>
			{auctions.map((auction, index: number) => (
				<div key={index} className={styles.card}>
					<div className={styles.cardHeader}>
						<LockUp
							title={auction.name}
							subtitle="Upcoming Auction"
							theme={iTheme.Light}
						/>
					</div>
					<div className={styles.cardContent}>
						<p className={styles.itemsCount}>Items Available: {auction.itemsCount}</p>
						<div className={styles.timer}>
							<CountdownTimer
								dateTime={auction.startTime}
								duration={auction.duration}
							/>
						</div>
						<Button
							// className={styles.previewButton}
							variant={"outline"}
							onClick={() =>
								router.push(`/auction/${encodeURIComponent(auction.name)}`)
							}>
							Preview Auction
						</Button>
					</div>
				</div>
			))}
		</div>
	);
};

export default UpcomingAuctions;
