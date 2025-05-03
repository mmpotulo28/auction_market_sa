"use client";
import React, { useEffect, useState } from "react";
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
import { iAuctionItem } from "@/lib/types";
import { FaUserCheck } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import AuctionSidebar from "./sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { useUser } from "@stackframe/stack";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { useWebSocket } from "@/context/WebSocketProvider";

interface AuctionItemListProps {
	items: iAuctionItem[];
	itemsPerPage?: number;
}

interface iBid {
	amount: number;
	userId: string;
	itemId: string;
	timestamp: string;
}

const AuctionItemList: React.FC<AuctionItemListProps> = ({ items, itemsPerPage = 10 }) => {
	const user = useUser();
	const router = useRouter();
	const [proposedBids, setProposedBids] = useState<iBid[]>(
		items.map((item) => ({
			amount: item.price,
			userId: "",
			itemId: item.id,
			timestamp: "",
		})),
	);

	const [currentPage, setCurrentPage] = useState(1);
	const [categories, setCategories] = useState<string[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>(categories);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
	const { placeBid, getHighestBid } = useWebSocket();
	const [selectedConditions, setSelectedConditions] = useState<Set<string>>(
		new Set(["new", "used"]),
	);

	useEffect(() => {
		const uniqueCategories = [...new Set(items.map((item) => item.category))];
		setCategories(uniqueCategories);
		setSelectedCategories(uniqueCategories);
	}, [items]);

	const totalPages = Math.ceil(items.length / itemsPerPage);
	const filteredItems = items.filter(
		(item) =>
			selectedCategories.includes(item.category) &&
			item.price >= priceRange[0] &&
			item.price <= priceRange[1] &&
			selectedConditions.has(item.condition),
	);
	const paginatedItems = filteredItems.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const toggleCategory = (category: string) => {
		setSelectedCategories((prev) =>
			prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category],
		);
	};

	const toggleCondition = (condition: string) => {
		setSelectedConditions((prev) => {
			const newConditions = new Set(prev);
			if (newConditions.has(condition)) {
				newConditions.delete(condition);
			} else {
				newConditions.add(condition);
			}
			return newConditions;
		});
	};

	const increaseBid = (id: string) => {
		setProposedBids((prevBids) =>
			prevBids.map((bid) => (bid.itemId === id ? { ...bid, amount: bid.amount + 10 } : bid)),
		);
	};

	const decreaseBid = (id: string) => {
		setProposedBids((prevBids) =>
			prevBids.map((bid) =>
				bid.itemId === id
					? {
							...bid,
							amount: Math.max(
								bid.amount - 10,
								items.find((item) => item.id === id)?.price || 0,
							),
					  }
					: bid,
			),
		);
	};

	const submitBid = (id: string) => {
		// check is user is logged in first
		if (!user) {
			toast("Login first to submit your bid", {
				description: "Please log in to place a bid. we need to note who owns a certain bid",
				action: {
					label: "Login",
					onClick: () => router.push("/auth?type=login&after_auth_return_to=/"),
				},
			});
			return;
		}

		const currentBid = proposedBids.find((bid) => bid.itemId === id)?.amount || 0;

		// add the current submitted bid to the bids array, just push it to the end
		placeBid(id, currentBid, user.id);

		// check if is now item owner
		const highestBid = getHighestBid(id);
		const isOwner = highestBid?.userId === user?.id;

		if (isOwner) {
			toast(`Congratulations, you now own this item!`, {
				description: "You are the current owner of this item, This can still change.",
				richColors: true,
			});
		} else {
			toast(`Bid not enough!`, {
				description: "You might need to increase your bid to own the item.",
				richColors: true,
			});
		}
	};

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
						<div className={styles.contentHeader}>
							<SidebarTrigger />
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Action not yet Open!</AlertTitle>
								<AlertDescription>
									This is a demo version of the auction system. The auction is not
									yet open for bidding. Please check back later.
								</AlertDescription>
							</Alert>
						</div>
						<div className={styles.grid}>
							{paginatedItems.map((item) => {
								const highestBid = getHighestBid(item.id);
								const currentBid =
									proposedBids.find((bid) => bid.itemId === item.id)?.amount || 0;

								const isOwner = highestBid?.userId === user?.id;

								return (
									<Card key={item.id} className={styles.card}>
										{/* Icon to indicate current user's bid */}
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
												onClick={() => decreaseBid(item.id)}
												disabled={
													currentBid <= (highestBid?.amount || item.price)
												}>
												<BiMinus />
											</Button>
											<Button
												variant="default"
												onClick={() => submitBid(item.id)}
												disabled={
													currentBid <= (highestBid?.amount || item.price)
												}>
												{currentBid > (highestBid?.amount || item.price) &&
													"Submit"}{" "}
												R {Number(currentBid)?.toFixed(2)}
											</Button>
											<Button
												variant="outline"
												onClick={() => increaseBid(item.id)}>
												<BiPlus />
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
