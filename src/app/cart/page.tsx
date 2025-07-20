"use client";
import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
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
import { FaOpencart } from "react-icons/fa";

export default function CartPage() {
	const { user } = useUser();
	const auth = useAuth();
	const { userWins } = useWebSocket();
	const [cart, setCart] = useState<iCart>();
	const [isLoading, setIsLoading] = useState(true);
	const [access_token, setAccessToken] = useState<string | null>();

	// Compute won items from websocket context
	useEffect(() => {
		async function fetchWonItems() {
			if (!userWins || !user) return;
			setIsLoading(true);

			const c: iCart = {
				id: "1",
				items: userWins,
				items_count: userWins.length,
				total_amount: userWins.reduce((acc, item) => acc + item.price, 0),
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				user_id: user?.id,
				status: "OPEN",
			};

			setCart(c);
			setIsLoading(false);
		}

		fetchWonItems();
	}, [user, userWins]);

	useEffect(() => {
		async function getToken() {
			const token = await auth.getToken();
			setAccessToken(token);
		}

		getToken();
	}, [auth]);

	const handleCheckout = () => {
		if (typeof window !== "undefined") {
			window.open(
				`https://payment.auctionmarket.tech/payment?token=${access_token}`,
				"_blank",
			);
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
			{cart && (
				<>
					<Actions
						actions={[
							{
								label: "Checkout",
								click: () => handleCheckout(),
								iconEnd: <FaOpencart />,
							},
						]}
					/>
					<CartSummary cart={cart} />
				</>
			)}

			{!cart && !isLoading && (
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
