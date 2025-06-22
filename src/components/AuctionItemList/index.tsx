"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
	PaginationLink,
} from "@/components/ui/pagination";
import Image from "next/image";
import styles from "./auction-item-list.module.css";
import { BiMinus, BiPlus } from "react-icons/bi";
import { Badge } from "../ui/badge";
import { FaSpinner, FaUserCheck } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import AuctionSidebar from "./sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { useWebSocket } from "@/context/WebSocketProvider";
import { useUser } from "@clerk/nextjs";
import { iAuction, iSize, typeBg, typeBorder } from "@/lib/types";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import Container from "../common/container";
import { TimerContainer } from "../CountdownTimer";
import LockUp from "../common/lockup";

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

const AuctionClosed: React.FC<{ ownedCount: number }> = ({ ownedCount }) => {
	const router = useRouter();
	return (
		<Container>
			<Card className={`${styles.contentHeader} ${typeBorder.error} ${typeBg.error} p-8`}>
				<h2 className="text-2xl font-bold">Auction Closed</h2>
				<p>
					You have <span className="font-semibold">{ownedCount}</span> item
					{ownedCount !== 1 && "s"} in your cart.
				</p>
				<Button variant="default" onClick={() => router.push("/cart")}>
					Go to Cart
				</Button>
			</Card>
		</Container>
	);
};

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
		async (itemId: string) => {
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
			await placeBid(itemId, currentBid, user.id);

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
		return Object.values(highestBids).filter((bid) => bid.userId === user.id).length;
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
												size={iSize.Small}
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
						<Dialog open={showBidHistory} onOpenChange={setShowBidHistory}>
							<DialogContent>
								<DialogTitle>Your Bid History</DialogTitle>
								{userBids.length === 0 ? (
									<p className="text-muted-foreground">
										You have not placed any bids yet.
									</p>
								) : (
									<ul className="divide-y">
										{userBids.map((bid) => (
											<li key={bid.itemId} className="py-2">
												<div className="flex flex-col sm:flex-row sm:items-center gap-2">
													<span className="font-semibold">
														{bid.item?.title}
													</span>
													<span className="text-sm text-muted-foreground">
														Bid: R {Number(bid.amount).toFixed(2)}
													</span>
													<span className="text-xs text-muted-foreground">
														{bid.timestamp &&
															new Date(
																bid.timestamp,
															).toLocaleString()}
													</span>
												</div>
											</li>
										))}
									</ul>
								)}
							</DialogContent>
						</Dialog>

						{/* items grid */}
						<div className={styles.grid}>
							{paginatedItems.map((item) => {
								const highestBid = highestBids[item.id];
								const currentBid =
									proposedBids.find((bid) => bid.itemId === item.id)?.amount ||
									highestBid?.amount ||
									0;
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
															<p>
																Your are the current owner of this
																item
															</p>
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
														Highest Bid: R{" "}
														{Number(
															highestBid?.amount || item.price,
														)?.toFixed(2)}
													</Badge>
													<Badge variant="secondary">
														{item.condition.toUpperCase()}
													</Badge>
												</div>
											</CardTitle>
										</CardHeader>
										<CardContent className="px-4">
											<div className={styles.imageContainer}>
												<Image
													src={item.image}
													alt={item.title}
													width={200}
													height={200}
												/>
											</div>
											<p className={styles.description}>{item.description}</p>
										</CardContent>
										<CardFooter className={`${styles.footer} px-4`}>
											<Button
												variant="outline"
												onClick={() => adjustBid(item.id, -10)}
												disabled={
													currentBid <=
														(highestBid?.amount || item.price) ||
													auctionClosed ||
													auctionNotStarted
												}>
												{isLoading ? (
													<FaSpinner className="spin" />
												) : (
													<BiMinus />
												)}
											</Button>
											<Button
												variant="default"
												onClick={() => submitBid(item.id)}
												disabled={
													currentBid <=
														(highestBid?.amount || item.price) ||
													pendingBids.includes(item.id) ||
													auctionClosed ||
													auctionNotStarted
												}>
												{currentBid > (highestBid?.amount || item.price) &&
													!pendingBids.includes(item.id) &&
													"Submit"}{" "}
												R {Number(currentBid)?.toFixed(2)}
												{(pendingBids.includes(item.id) || isLoading) && (
													<FaSpinner className="spin" />
												)}
											</Button>
											<Button
												variant="outline"
												onClick={() => adjustBid(item.id, 10)}
												disabled={auctionClosed || auctionNotStarted}>
												{isLoading ? (
													<FaSpinner className="spin" />
												) : (
													<BiPlus />
												)}
											</Button>
										</CardFooter>
									</Card>
								);
							})}
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
