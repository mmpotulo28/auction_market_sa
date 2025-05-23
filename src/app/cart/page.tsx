"use client";
import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
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

const TWENTY_MINUTES = 20 * 60; // seconds

export default function CartPage() {
	const { user } = useUser();
	const router = useRouter();
	const { items, highestBids } = useWebSocket();

	// Compute won items from websocket context
	const wonItems = useMemo(() => {
		if (!user) return [];
		if (!items || !highestBids) return [];
		const w = items.map((item) => {
			if (highestBids[item.id]?.userId === user.id) {
				return {
					...item,
					price: highestBids[item.id].amount,
				};
			}

			return null;
		});
		return w.filter((item) => item !== null) as typeof items;
	}, [items, highestBids, user]);

	const [secondsLeft, setSecondsLeft] = useState(TWENTY_MINUTES);
	const [expired, setExpired] = useState(false);
	const [clearError, setClearError] = useState<string | null>(null);

	useEffect(() => {
		if (expired && wonItems.length > 0) {
			// Set all owned items as available via API
			const updateItems = async () => {
				try {
					await axios.put(
						"/api/items/status",
						wonItems.map((item) => ({
							itemId: item.id,
							status: "available",
						})),
					);
					// axios throws on non-2xx, so check for error in catch
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
	}, [expired, wonItems]);

	useEffect(() => {
		if (expired) return;
		if (secondsLeft <= 0) {
			setExpired(true);
			return;
		}
		const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
		return () => clearInterval(timer);
	}, [secondsLeft, expired]);

	const handleCheckout = () => {
		// ...checkout logic...
		alert("Checked out successfully!");
		router.push("/");
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
			{expired ? (
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
					<div className="flex justify-between items-center mb-6">
						<span className="text-lg font-semibold">
							Time left to checkout:{" "}
							<span className="text-red-600">{formatTime(secondsLeft)}</span>
						</span>
						<Button
							variant="default"
							onClick={handleCheckout}
							disabled={wonItems.length === 0}>
							Checkout
						</Button>
					</div>
					{wonItems.length === 0 ? (
						<p>You have no items in your cart.</p>
					) : (
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
					)}
				</>
			)}
		</Container>
	);
}
