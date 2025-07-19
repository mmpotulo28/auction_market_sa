"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Container from "@/components/common/container";
import { Card } from "@/components/ui/card";
import { useWebSocket } from "@/context/WebSocketProvider";
import { iCart } from "@/lib/types";
import Illustration from "@/components/Illustration";
import CustomerAd from "@/components/ads/CustomerAd";
import { Separator } from "@/components/ui/separator";
import ShareApp from "@/components/Footer/ShareApp";
import { Smile } from "lucide-react";
import CartSummary from "@/components/CartSummary";
import Actions from "@/components/common/Actions";
import axios from "axios";

export default function CartPage() {
	const { user } = useUser();
	const { items, highestBids } = useWebSocket();
	const [cart, setCart] = useState<iCart>();
	const [isLoading, setIsLoading] = useState(false);

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
				.filter((item) => item !== undefined);

			const c: iCart = {
				id: "1",
				items: w,
				items_count: w.length,
				total_amount: w.reduce((acc, item) => acc + item.price, 0),
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				user_id: user.id,
				status: "OPEN",
			};

			setCart(c);
			setIsLoading(false);
		}

		fetchWonItems();
	}, [items, highestBids, user]);

	const handleCheckout = () => {
		console.log("Checkout clicked");
		// Redirect to payment page "https://payment.auctionsmarket.tech/payment"
		if (typeof window !== "undefined") {
			window.open("https://payment.auctionmarket.tech/payment", "_blank");
		} else {
			axios.post("/api/checkout", cart).then(
				(response) => {
					console.log(response.data);
					window.location.href = response.data.url;
				},
				(error) => {
					console.log(error);
				},
			);
		}
	};

	return (
		<Container>
			{isLoading && <Illustration type="loading" className="mx-auto my-5" />}
			{cart ? (
				<>
					<Actions
						actions={[
							{
								label: "Checkout",
								click: () => handleCheckout(),
							},
						]}
					/>
					<CartSummary cart={cart} />
				</>
			) : (
				<Card className="flex flex-col items-center justify-center py-16 px-8 max-w-lg mx-auto mt-10 shadow-lg border-0 bg-gradient-to-br from-muted/80 to-background">
					<Smile className="w-16 h-16 text-accent mb-4" />
					<h2 className="text-2xl font-bold mb-2 text-center">No items in your cart</h2>
					<p className="text-muted-foreground text-center mb-2">
						You haven&apos;t won any items yet. Participate in an auction to win items
						and they will appear here!
					</p>
				</Card>
			)}

			<Separator className="my-3" />
			<ShareApp />
			<CustomerAd variant="banner" />
			<Separator className="my-3" />
		</Container>
	);
}
