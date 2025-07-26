import styles from "./auction-item-list.module.css";
import { BiMinus, BiPlus } from "react-icons/bi";
import { FaUserCheck, FaSpinner } from "react-icons/fa";
import { CarouselDApiSlider } from "../TopBanner/slider";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Badge } from "../ui/badge";
import React from "react";
import { iAuctionItem } from "@/lib/types";

interface iItemCardProps {
	item: iAuctionItem;
	highestBids: any;
	proposedBids: any;
	user: any;
	adjustBid: any;
	submitBid: any;
	pendingBids: any;
	isLoading: any;
	auctionClosed: any;
	auctionNotStarted: any;
}

const ItemCard: React.FC<iItemCardProps> = ({
	item,
	highestBids,
	proposedBids,
	user,
	adjustBid,
	submitBid,
	pendingBids,
	isLoading,
	auctionClosed,
	auctionNotStarted,
}) => {
	const highestBid = highestBids[item.id];
	const currentBid =
		proposedBids.find((bid) => bid.itemId === item.id)?.amount || highestBid?.amount || 0;
	const isOwner = highestBid?.userId === user?.id;

	return (
		<Card key={item.id} className={styles.card}>
			{isOwner && (
				<div className={styles.userIcon}>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<FaUserCheck title="Your Bid" />
							</TooltipTrigger>
							<TooltipContent>
								<p>Your are the current owner of this item</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			)}
			<CardHeader className="px-4">
				<CardTitle>
					<h3 className={styles.title}>{item.title}</h3>

					<div className={styles.tags}>
						<Badge variant={"destructive"}>
							Highest Bid: R {Number(highestBid?.amount || item.price)?.toFixed(2)}
						</Badge>
						<Badge variant="secondary">{item.condition.toUpperCase()}</Badge>
					</div>
				</CardTitle>
			</CardHeader>

			<CardContent className="px-4">
				<div className={styles.imageContainer}>
					<CarouselDApiSlider items={item} />
				</div>
				<p className={styles.description}>{item.description}</p>
			</CardContent>

			<CardFooter className={`${styles.footer} px-4`}>
				<Button
					variant="outline"
					onClick={() => adjustBid(item.id, -10)}
					disabled={
						currentBid <= (highestBid?.amount || item.price) ||
						auctionClosed ||
						auctionNotStarted
					}>
					{isLoading ? <FaSpinner className="spin" /> : <BiMinus />}
				</Button>
				<Button
					variant="default"
					onClick={() => submitBid(item.id, item.title)}
					disabled={
						currentBid <= (highestBid?.amount || item.price) ||
						pendingBids.includes(item.id) ||
						auctionClosed ||
						auctionNotStarted
					}>
					{currentBid > (highestBid?.amount || item.price) &&
						!pendingBids.includes(item.id) &&
						"Submit"}{" "}
					R {Number(currentBid)?.toFixed(2)}
					{(pendingBids.includes(item.id) || isLoading) && <FaSpinner className="spin" />}
				</Button>
				<Button
					variant="outline"
					onClick={() => adjustBid(item.id, 10)}
					disabled={auctionClosed || auctionNotStarted}>
					{isLoading ? <FaSpinner className="spin" /> : <BiPlus />}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default ItemCard;
