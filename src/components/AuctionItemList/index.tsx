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

interface AuctionItemListProps {
	items: iAuctionItem[];
	categories: string[];
	itemsPerPage?: number;
	currentUserId?: string; // Added to identify the current user
}

interface iBid {
	amount: number;
	userId: string;
	itemId: string;
	timestamp: string;
}

const AuctionItemList: React.FC<AuctionItemListProps> = ({
	items,
	categories,
	itemsPerPage = 20,
	currentUserId = "0",
}) => {
	const [proposedBids, setProposedBids] = useState<iBid[]>(
		items.map((item) => ({
			amount: item.price,
			userId: "",
			itemId: item.id,
			timestamp: "",
		})),
	);
	const [bids, setBids] = useState<iBid[]>(
		items.map((item) => ({
			amount: item.price,
			userId: "",
			itemId: item.id,
			timestamp: "",
		})),
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedCategories, setSelectedCategories] = useState<string[]>(categories);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
	const [selectedConditions, setSelectedConditions] = useState<Set<string>>(
		new Set(["new", "used"]),
	);

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

		// set current bid
		const currentBid = proposedBids.find((bid) => bid.itemId === id)?.amount || 0;
		console.log(`Current bid for item ${id}: ${currentBid}`); // Log current bid for debugging
	};

	const submitBid = (id: string) => {
		const currentBid = proposedBids.find((bid) => bid.itemId === id)?.amount || 0;
		console.log(`Submitting bid for item ${id} with current bid: ${currentBid}`);

		// add the current submitted bid to the bids array, just push it to the end
		setBids((prevBids) => [
			...prevBids,
			{
				amount: currentBid,
				userId: currentUserId,
				itemId: id,
				timestamp: new Date().toISOString(),
			},
		]);
	};

	const getHighestBid = (itemId: string): iBid | undefined => {
		return bids
			.filter((bid) => bid.itemId === itemId)
			.reduce((highest, current) => (current.amount > highest.amount ? current : highest), {
				amount: 0,
				userId: "",
				itemId: "",
				timestamp: "",
			});
	};

	// log proposedBids every time a new bid is received
	useEffect(() => {
		console.log("Bids updated:", bids);
	}, [bids]); // Log bids whenever they change

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
						<SidebarTrigger />
						<div className={styles.grid}>
							{paginatedItems.map((item) => {
								const highestBid = getHighestBid(item.id);
								const currentBid =
									proposedBids.find((bid) => bid.itemId === item.id)?.amount || 0;

								const isOwner = highestBid?.userId === currentUserId;
								if (isOwner) {
									console.log(
										`Is current user the owner of item ${item.id}? ${isOwner}`,
									);
								}

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
