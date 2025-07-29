"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
	PaginationLink,
} from "@/components/ui/pagination";
import styles from "./auction-item-list.module.css";
import AuctionSidebar from "./sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { useWebSocket } from "@/context/WebSocketProvider";
import { useUser } from "@clerk/nextjs";
import { iAuction, iSize, typeBg, typeBorder } from "@/lib/types";
import Container from "../common/container";
import { TimerContainer } from "../CountdownTimer";
import LockUp from "../common/lockup";
import AuctionClosed from "./AuctionClosed";
import ItemCard from "./ItemCard";
import UserBids from "./UserBids";

interface AuctionItemListProps {
	itemsPerPage?: number;
	auction?: iAuction;
}

interface iBid {
	amount: number;
	userId: string;
	itemId: string;
	timestamp: string;
}

const AuctionItemList: React.FC<AuctionItemListProps> = ({ itemsPerPage = 10, auction }) => {
	const { user } = useUser();
	const router = useRouter();

	const { placeBid, highestBids, items, isLoading, error, categories } = useWebSocket();

	const [proposedBids, setProposedBids] = useState<iBid[]>([]);

	const [currentPage, setCurrentPage] = useState(1);
	const [selectedCategories, setSelectedCategories] = useState<string[]>(categories);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
	const [selectedConditions, setSelectedConditions] = useState<Set<string>>(
		new Set(["new", "used"]),
	);
	const [pendingBids, setPendingBids] = useState<string[]>([]);
	const [showBidHistory, setShowBidHistory] = useState(false);
	const [auctionNotStarted, setAuctionNotStarted] = useState(false);
	const [auctionClosed, setAuctionClosed] = useState(false);
	const [auctionEndTime, setAuctionEndTime] = useState<Date>(new Date());

	useEffect(() => {
		if(categories.length > 0) {
			setSelectedCategories(categories);
		}
	}, [categories]);

	useEffect(() => {
		if (auction) {
			const auctionStart = new Date(auction.start_time).getTime();
			const auctionEnd = auctionStart + (auction.duration || 0) * 60 * 1000;
			const now = Date.now();

			setAuctionNotStarted(now < auctionStart);
			setAuctionClosed(now > auctionEnd);
			setAuctionEndTime(new Date(auctionEnd));
		}
	}, [auction]);

	// User bid history
	const userBids = useMemo(() => {
		if (!user) return [];
		const allBids = Object.values(highestBids)
			.filter((bid) => bid.userId === user.id)
			.map((bid) => ({
				...bid,
				item: items.find((item) => item.id === bid.itemId),
			}))
			.filter((b) => b.item);
		return allBids;
	}, [highestBids, user, items]);

	const filteredItems = useMemo(
		() =>
			items.filter(
				(item) =>
					selectedCategories.includes(item.category) &&
					item.price >= priceRange[0] &&
					item.price <= priceRange[1] &&
					selectedConditions.has(item.condition),
			),
		[items, selectedCategories, priceRange, selectedConditions],
	);

	const totalPages = useMemo(
		() => Math.ceil(filteredItems.length / itemsPerPage),
		[filteredItems, itemsPerPage],
	);
	const paginatedItems = useMemo(
		() => filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
		[filteredItems, currentPage, itemsPerPage],
	);

	const toggleCategory = useCallback((category: string) => {
		setSelectedCategories((prev) =>
			prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category],
		);
	}, []);

	const toggleCondition = useCallback((condition: string) => {
		setSelectedConditions((prev) => {
			const newConditions = new Set(prev);
			if (newConditions.has(condition)) {
				newConditions.delete(condition);
			} else {
				newConditions.add(condition);
			}
			return newConditions;
		});
	}, []);

	const adjustBid = useCallback(
		(id: string, delta: number) => {
			setProposedBids((prevBids) => {
				const existingBid = prevBids.find((bid) => bid.itemId === id);
				if (existingBid) {
					return prevBids.map((bid) =>
						bid.itemId === id
							? {
									...bid,
									amount: Math.max(
										bid.amount + delta,
										items.find((item) => item.id === id)?.price || 0,
									),
							  }
							: bid,
					);
				} else {
					const highestBidAmount = highestBids[id]?.amount || 0;
					const itemPrice = items.find((item) => item.id === id)?.price || 0;
					return [
						...prevBids,
						{
							itemId: id,
							amount: Math.max(highestBidAmount, itemPrice) + delta,
							userId: user?.id || "",
							timestamp: new Date().toISOString(),
						},
					];
				}
			});
		},
		[items, highestBids, user],
	);

	const submitBid = useCallback(
		async (itemId: string, itemName: string) => {
			if (!user) {
				toast("Login first to submit your bid", {
					description: "Please log in to place a bid.",
					action: {
						label: "Login",
						onClick: () => router.push("/auth?type=login&after_auth_return_to=/"),
					},
				});
				return;
			}

			const currentBid = proposedBids.find((bid) => bid.itemId === itemId)?.amount || 0;

			setPendingBids((prev) => [...prev, itemId]);
			await placeBid(itemId, itemName, currentBid, user.id);

			const highestBid = highestBids[itemId];
			if (highestBid?.userId === user.id) {
				toast("Congratulations, you now own this item!", {
					description: "You are the current owner of this item.",
					richColors: true,
				});
			}

			setPendingBids((prev) => prev.filter((bid) => bid !== itemId));
		},
		[proposedBids, user, placeBid, highestBids, router],
	);

	const ownedCount = useMemo(() => {
		if (!user) return 0;
		return Object.values(highestBids).filter((bid: iBid) => bid.userId === user.id).length;
	}, [highestBids, user]);

	if (!auction) {
		return (
			<Container>
				<Alert variant="destructive">
					<AlertCircle />
					<AlertTitle>No auction data available</AlertTitle>
					<AlertDescription>
						Please check your connection or try again later.
					</AlertDescription>
				</Alert>
			</Container>
		);
	}

	if (auctionClosed) {
		return <AuctionClosed ownedCount={ownedCount} />;
	}

	return (
		<SidebarProvider>
			<div className={styles.container}>
				<AuctionSidebar
					categories={categories}
					selectedCategories={selectedCategories}
					toggleCategory={toggleCategory}
					priceRange={priceRange}
					setPriceRange={setPriceRange}
					toggleCondition={toggleCondition}
					selectedConditions={selectedConditions}
				/>
				<SidebarInset>
					<main className={styles.mainContent}>
						{error.length > 0 && (
							<Card className="max-w-2xl mx-auto py-10 px-4">
								{error.map((err, index) => (
									<Alert key={index} variant="destructive" className="mb-6">
										<AlertCircle className="h-4 w-4" />
										<AlertTitle>Error</AlertTitle>
										<AlertDescription>{err}</AlertDescription>
									</Alert>
								))}
							</Card>
						)}

						{/* header */}
						<Card
							className={`${styles.contentHeader} ${
								auctionNotStarted ? typeBorder.error : typeBorder.success
							} ${auctionNotStarted ? typeBg.error : typeBg.success}`}>
							<SidebarTrigger />
							<span className={styles.auctionTitle}>
								<LockUp
									title={auction.name}
									overline={
										auctionNotStarted
											? "Auction not started"
											: "it's on, Have fun!"
									}
								/>
							</span>
							{auction && (
								<div className={styles.auctionHeader}>
									{!auctionNotStarted && (
										<div className={styles.auctionTimer}>
											<TimerContainer
												size={iSize.Medium}
												targetDate={auctionEndTime.toLocaleString()}
												onExpire={() => {
													setAuctionClosed(true);
												}}
											/>
										</div>
									)}
									{auctionNotStarted && (
										<div className={styles.auctionTimer}>
											<TimerContainer
												size={iSize.Medium}
												targetDate={(auction?.start_time).toLocaleString()}
												onExpire={() => {
													setAuctionNotStarted(false);
												}}
											/>
										</div>
									)}
								</div>
							)}
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowBidHistory(true)}
								className="ml-auto">
								Your Bids
							</Button>
							{/* ...existing alerts... */}
						</Card>

						{/* User Bid History Dialog */}
						<UserBids
							userBids={userBids}
							showBidHistory={showBidHistory}
							setShowBidHistory={setShowBidHistory}
						/>

						{/* items grid */}
						<div className={styles.grid}>
							{paginatedItems.map((item) => (
								<ItemCard
									key={item.id}
									highestBids={highestBids}
									item={item}
									proposedBids={proposedBids}
									user={user}
									adjustBid={adjustBid}
									submitBid={submitBid}
									pendingBids={pendingBids}
									isLoading={isLoading}
									auctionClosed={auctionClosed}
									auctionNotStarted={auctionNotStarted}
								/>
							))}
						</div>

						<div className={styles.pagination}>
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											onClick={() =>
												setCurrentPage((prev) => Math.max(prev - 1, 1))
											}
										/>
									</PaginationItem>
									{Array.from({ length: totalPages }, (_, index) => (
										<PaginationItem key={index}>
											<PaginationLink
												onClick={() => setCurrentPage(index + 1)}
												className={
													currentPage === index + 1 ? "active" : ""
												}>
												{index + 1}
											</PaginationLink>
										</PaginationItem>
									))}
									<PaginationItem>
										<PaginationNext
											onClick={() =>
												setCurrentPage((prev) =>
													Math.min(prev + 1, totalPages),
												)
											}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
};

export default AuctionItemList;
