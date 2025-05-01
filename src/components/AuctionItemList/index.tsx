"use client";

import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import styles from "./auction-item-list.module.css";
import { BiMinus, BiPlus } from "react-icons/bi";
import { Badge } from "../ui/badge";

interface AuctionItem {
	id: string;
	title: string;
	description: string;
	price: number;
	image: string;
	category: string;
}

interface AuctionItemListProps {
	items: AuctionItem[];
	categories: string[];
	itemsPerPage?: number;
}

const AuctionItemList: React.FC<AuctionItemListProps> = ({
	items,
	categories,
	itemsPerPage = 20,
}) => {
	const [bids, setBids] = useState<Record<string, number>>(
		items.reduce((acc, item) => ({ ...acc, [item.id]: item.price }), {}),
	);
	const [highestBids, setHighestBids] = useState<Record<string, number>>(
		items.reduce((acc, item) => ({ ...acc, [item.id]: item.price }), {}),
	);
	const [isBidSubmitted, setIsBidSubmitted] = useState<Record<string, boolean>>(
		items.reduce((acc, item) => ({ ...acc, [item.id]: true }), {}),
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedCategories, setSelectedCategories] = useState<string[]>(categories);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);

	const totalPages = Math.ceil(items.length / itemsPerPage);
	const filteredItems = items.filter(
		(item) =>
			selectedCategories.includes(item.category) &&
			item.price >= priceRange[0] &&
			item.price <= priceRange[1],
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

	const increaseBid = (id: string) => {
		setBids((prevBids) => ({
			...prevBids,
			[id]: Number(prevBids[id]) + 10,
		}));
		setIsBidSubmitted((prev) => ({ ...prev, [id]: false }));
	};

	const decreaseBid = (id: string) => {
		setBids((prevBids) => ({
			...prevBids,
			[id]: Math.max(
				Number(prevBids[id]) - 10,
				items.find((item) => item.id === id)?.price || 0,
			),
		}));
		setIsBidSubmitted((prev) => ({ ...prev, [id]: false }));
	};

	const submitBid = (id: string) => {
		setHighestBids((prevHighestBids) => ({
			...prevHighestBids,
			[id]: Math.max(prevHighestBids[id], bids[id]),
		}));
		setIsBidSubmitted((prev) => ({ ...prev, [id]: true }));
	};

	return (
		<div className={styles.container}>
			<aside className={styles.sidebar}>
				<h3>Filter by Category</h3>

				{categories.map((category) => (
					<div key={category} className={styles.checkbox}>
						<Checkbox
							id={category}
							checked={selectedCategories.includes(category)}
							onCheckedChange={() => toggleCategory(category)}
						/>
						<label htmlFor={category}>{category}</label>
					</div>
				))}

				<Separator className="my-6" />
				<h3>Filter by Price</h3>
				<div className={styles.slider}>
					<Slider
						min={0}
						max={2000}
						value={priceRange}
						onValueChange={(value) => setPriceRange(value as [number, number])}
					/>
					<div className={styles.priceRange}>
						<span>R{priceRange[0]}</span>
						<span>R{priceRange[1]}</span>
					</div>
				</div>
			</aside>

			<main className={styles.mainContent}>
				<div className={styles.grid}>
					{paginatedItems.map((item) => (
						<Card key={item.id} className={styles.card}>
							<CardHeader className="px-4">
								<CardTitle>
									<h3 className={styles.title}>{item.title}</h3>
									<Badge variant={"destructive"}>
										Highest Bid: R {Number(highestBids[item.id])?.toFixed(2)}
									</Badge>
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
								<Button variant="outline" onClick={() => decreaseBid(item.id)}>
									<BiMinus />
								</Button>
								<Button
									variant="default"
									onClick={() => submitBid(item.id)}
									disabled={isBidSubmitted[item.id]}>
									{!isBidSubmitted[item.id] && "Submit"} R{" "}
									{Number(bids[item.id])?.toFixed(2)}
								</Button>
								<Button variant="outline" onClick={() => increaseBid(item.id)}>
									<BiPlus />
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
				<div className={styles.pagination}>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
								/>
							</PaginationItem>
							{Array.from({ length: totalPages }, (_, index) => (
								<PaginationItem key={index}>
									<PaginationLink
										onClick={() => setCurrentPage(index + 1)}
										className={currentPage === index + 1 ? "active" : ""}>
										{index + 1}
									</PaginationLink>
								</PaginationItem>
							))}
							<PaginationItem>
								<PaginationNext
									onClick={() =>
										setCurrentPage((prev) => Math.min(prev + 1, totalPages))
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</main>
		</div>
	);
};

export default AuctionItemList;
