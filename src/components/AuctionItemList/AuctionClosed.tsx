"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Container from "../common/container";

interface AuctionClosedProps {
	ownedCount: number;
}

const AuctionClosed: React.FC<AuctionClosedProps> = ({ ownedCount }) => {
	const router = useRouter();
	return (
		<Container>
			<Card className="max-w-md mx-auto mt-16 shadow-lg border-0 bg-gradient-to-br from-muted/80 to-background">
				<CardHeader className="flex flex-col items-center gap-2">
					<CheckCircle2 className="w-14 h-14 text-green-500 mb-2" />
					<CardTitle className="text-2xl font-bold text-center">Auction Closed</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-4">
					<p className="text-center text-muted-foreground">
						Thank you for participating in this auction!
					</p>
					<div className="flex flex-col items-center gap-2">
						<ShoppingCart className="w-8 h-8 text-primary" />
						<p className="font-medium">
							You have <span className="font-bold">{ownedCount}</span> item
							{ownedCount !== 1 && "s"} in your cart.
						</p>
					</div>
				</CardContent>
				<CardFooter className="flex justify-center">
					<Button variant="default" size="lg" onClick={() => router.push("/cart")}>
						View Cart
					</Button>
				</CardFooter>
			</Card>
		</Container>
	);
};

export default AuctionClosed;
