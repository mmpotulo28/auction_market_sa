"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Container from "@/components/common/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useWebSocket } from "@/context/WebSocketProvider";
import Image from "next/image";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
	TableCaption,
} from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import { iAuctionItem, iAuction } from "@/lib/types";
import Illustration from "@/components/Illustration";
import CustomerAd from "@/components/ads/CustomerAd";
import { Separator } from "@/components/ui/separator";
import ShareApp from "@/components/Footer/ShareApp";
import { fetchAuctionByName } from "@/lib/helpers";
import { Smile } from "lucide-react";

const TWENTY_MINUTES = 20 * 60; // seconds

export default function CartPage() {
	const { user } = useUser();
	const { items, highestBids, isLoading: AuctionLoading } = useWebSocket();
	const [secondsLeft, setSecondsLeft] = useState(TWENTY_MINUTES);
	const [expired, setExpired] = useState(false);
	const [clearError, setClearError] = useState<string | null>(null);
	const [payfastLoading, setPayfastLoading] = useState(false);
	const [wonItems, setWonItems] = useState<iAuctionItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [auction, setAuction] = useState<iAuction | null>(null);
	console.log("auction:", auction);
	const [checkoutWindowClosed, setCheckoutWindowClosed] = useState(false);

	// Compute won items from websocket context
	useEffect(() => {
		async function fetchWonItems() {
			if (!user) return [];
			if (!items || !highestBids) return [];
			setIsLoading(true);

			const w = items
				.map((item) => {
					if (highestBids[item.id].userId === user.id) {
						return {
							...item,
							price: highestBids[item.id].amount,
						};
					}
				})
				.filter((item): item is iAuctionItem => item !== undefined);

			setWonItems(w);
			setIsLoading(false);
		}

		fetchWonItems();
	}, [items, highestBids, user]);

	// Fetch auction for first won item and set checkout deadline
	useEffect(() => {
		let timer: NodeJS.Timeout | undefined;
		const updateTimer = async () => {
			if (wonItems.length > 0) {
				setIsLoading(true);
				const firstItem = wonItems[0];
				const auctionName = firstItem.auction.name || "";
				if (auctionName) {
					const auctionData = await fetchAuctionByName(auctionName);
					setAuction(auctionData || null);

					if (auctionData) {
						const auctionStart = new Date(auctionData.start_time).getTime();
						const auctionEnd = auctionStart + (auctionData.duration || 0) * 60 * 1000;
						const checkoutDeadline = auctionEnd + TWENTY_MINUTES * 1000;
						const now = Date.now();

						// Only use auction-based checkout time if auction is still open
						if (now < checkoutDeadline) {
							setCheckoutWindowClosed(false);
							const secs = Math.floor((checkoutDeadline - now) / 1000);
							setSecondsLeft(secs > 0 ? secs : 0);
							setExpired(secs <= 0);
						} else {
							setCheckoutWindowClosed(true);
							setSecondsLeft(0);
							setExpired(true);
						}
					} else {
						// fallback: just use 20min
						setCheckoutWindowClosed(false);
						setSecondsLeft(TWENTY_MINUTES);
						setExpired(false);
					}
				} else {
					// fallback: just use 20min
					setAuction(null);
					setCheckoutWindowClosed(false);
					setSecondsLeft(TWENTY_MINUTES);
					setExpired(false);
				}
				setIsLoading(false);
			} else {
				setAuction(null);
				setCheckoutWindowClosed(false);
				setSecondsLeft(TWENTY_MINUTES);
				setExpired(false);
			}
		};
		updateTimer();

		return () => {
			if (timer) clearInterval(timer);
		};
	}, [wonItems]);

	// Timer countdown
	useEffect(() => {
		if (expired || checkoutWindowClosed) return;
		if (secondsLeft <= 0) {
			setExpired(true);
			return;
		}
		const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
		return () => clearInterval(timer);
	}, [secondsLeft, expired, checkoutWindowClosed]);

	// If checkout window closed, mark items as available
	useEffect(() => {
		if ((expired || checkoutWindowClosed) && wonItems.length > 0) {
			const updateItems = async () => {
				try {
					await axios.put(
						"/api/items/status",
						wonItems.map((item) => ({
							itemId: item.id,
							status: "available",
						})),
					);
					setClearError(null);
				} catch (e: unknown) {
					let msg = "Failed to update item status.";
					if (typeof e === "object" && e !== null) {
						const err = e as {
							response?: { data?: { error?: string; errors?: { error: string }[] } };
							message?: string;
						};
						if (err.response?.data?.error) {
							msg = err.response.data.error;
						} else if (
							err.response?.data?.errors &&
							Array.isArray(err.response.data.errors)
						) {
							msg = err.response.data.errors
								.map((err: { error: string }) => err.error)
								.join(", ");
						} else if (err.message) {
							msg = err.message;
						}
					}
					setClearError(msg);
				}
			};
			updateItems();
		}
	}, [expired, checkoutWindowClosed, wonItems]);

	const handleCheckout = async () => {
		if (wonItems.length === 0) return;
		setPayfastLoading(true);
		setIsLoading(true);
		try {
			const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
			const uniqueRef = Math.random().toString(36).substring(2, 9);
			const auctionRef = `AMSA-${dateStr}-${uniqueRef}-${user?.username}`;
			const itemNames = wonItems.map((item) => item.title).join(", ");
			const m_payment_id = `amsa_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
			const order_id = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
			const orderItems = wonItems;
			const payfastItems = wonItems.map((item) => ({
				...item,
				name: auctionRef,
				description: itemNames,
				amount: item.price,
			}));

			const [orderRes, payfastRes] = await Promise.all([
				axios.post("/api/orders/create", {
					items: orderItems,
					user,
					payment_id: m_payment_id,
					order_id,
				}),
				axios.post("/api/payfast/initiate", {
					items: payfastItems,
					user,
					m_payment_id,
					order_id,
				}),
			]);

			if (!orderRes.data || !orderRes.data.orders) {
				toast.error("Failed to create order. Please try again.");
				setPayfastLoading(false);
				setIsLoading(false);
				return;
			}
			if (!payfastRes.data || !payfastRes.data.formHtml || !payfastRes.data.m_payment_id) {
				toast.error("Failed to initiate payment. Please try again.");
				setPayfastLoading(false);
				setIsLoading(false);
				return;
			}

			// Store m_payment_id in a cookie for validation on return page
			document.cookie = `payfast_m_payment_id=${payfastRes.data.m_payment_id}; path=/; max-age=1800; SameSite=Lax`;
			const div = document.createElement("div");
			div.style.display = "none";
			div.innerHTML = payfastRes.data.formHtml;
			document.body.appendChild(div);
			const form = div.querySelector("form") as HTMLFormElement | null;
			if (form) {
				form.submit();
			} else {
				toast.error("Failed to initiate payment. Please try again.");
			}
		} catch (e: any) {
			const msg =
				e?.response?.data?.error ||
				e?.message ||
				"Failed to initiate payment. Please try again.";
			toast.error(msg);
		}
		setPayfastLoading(false);
		setIsLoading(false);
	};

	const formatTime = (secs: number) => {
		const m = Math.floor(secs / 60)
			.toString()
			.padStart(2, "0");
		const s = (secs % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	};

	return (
		<Container>
			<h1 className="text-3xl font-bold text-center my-8">Your Cart</h1>
			{checkoutWindowClosed ? (
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Checkout Window Closed</AlertTitle>
					<AlertDescription>
						The auction for your items has ended and the checkout window is closed. All
						items will be returned to the auction and marked as available.
					</AlertDescription>
				</Alert>
			) : expired ? (
				<>
					<Alert variant="destructive" className="mb-6">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Time Expired!</AlertTitle>
						<AlertDescription>
							Your cart session has expired. All items have been released for the next
							auction.
						</AlertDescription>
					</Alert>
					{clearError && (
						<Alert variant="destructive" className="mb-6">
							<AlertTitle>Error updating items</AlertTitle>
							<AlertDescription>{clearError}</AlertDescription>
						</Alert>
					)}
				</>
			) : (
				<>
					{wonItems.length > 0 ? (
						<>
							<div className="flex justify-between items-center mb-6">
								<span className="text-lg font-semibold">
									Time left to checkout:{" "}
									<span className="text-red-600">{formatTime(secondsLeft)}</span>
								</span>
								<Button
									variant="default"
									onClick={handleCheckout}
									disabled={wonItems.length === 0 || payfastLoading}>
									{payfastLoading ? "Redirecting to PayFast..." : "Checkout"}
								</Button>
							</div>
							{(isLoading || AuctionLoading) && (
								<Illustration type="loading" className="m-auto" />
							)}
							<Card className="overflow-x-auto p-0">
								<Table>
									<TableCaption>Your auction winnings</TableCaption>
									<TableHeader>
										<TableRow>
											<TableHead>Image</TableHead>
											<TableHead>Title</TableHead>
											<TableHead>Description</TableHead>
											<TableHead>Price</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{wonItems.map((item) => (
											<TableRow key={item.id}>
												<TableCell>
													<Dialog>
														<DialogTrigger asChild>
															<button
																type="button"
																style={{
																	background: "none",
																	border: "none",
																	padding: 0,
																	cursor: "pointer",
																}}
																aria-label={`Preview ${item.title}`}>
																<Image
																	src={item.image}
																	alt={item.title}
																	width={64}
																	height={64}
																	style={{ borderRadius: 8 }}
																/>
															</button>
														</DialogTrigger>
														<DialogContent className="flex flex-col items-center">
															<DialogTitle>{item.title}</DialogTitle>
															<Image
																src={item.image}
																alt={item.title}
																width={400}
																height={400}
																style={{
																	borderRadius: 5,
																	maxWidth: "90vw",
																	height: "auto",
																}}
															/>
														</DialogContent>
													</Dialog>
												</TableCell>
												<TableCell className="font-semibold">
													{item.title}
												</TableCell>
												<TableCell>{item.description}</TableCell>
												<TableCell className="font-bold">
													R {item.price}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</Card>
						</>
					) : (
						<Card className="flex flex-col items-center justify-center py-16 px-8 max-w-lg mx-auto mt-10 shadow-lg border-0 bg-gradient-to-br from-muted/80 to-background">
							<Smile className="w-16 h-16 text-accent mb-4" />
							<h2 className="text-2xl font-bold mb-2 text-center">
								No items in your cart
							</h2>
							<p className="text-muted-foreground text-center mb-2">
								You haven&apos;t won any items yet. Participate in an auction to win
								items and they will appear here!
							</p>
						</Card>
					)}
				</>
			)}

			<Separator className="my-3" />
			<ShareApp />
			<CustomerAd variant="banner" />
			<Separator className="my-3" />
		</Container>
	);
}
