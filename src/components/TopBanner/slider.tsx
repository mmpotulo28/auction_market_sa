"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";

import { iAuctionItem } from "@/lib/types";
import { useWebSocket } from "@/context/WebSocketProvider";
import Illustration from "../Illustration";

interface iCarouselDApiSlider {
	items?: iAuctionItem[] | iAuctionItem;
	controls?: boolean;
}

export const CarouselDApiSlider: React.FC<iCarouselDApiSlider> = ({ controls = true, items }) => {
	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(0);
	const { items: auctionItems, isLoading } = useWebSocket();

	if (items === undefined) {
		items = auctionItems;
	}

	console.log(items);

	React.useEffect(() => {
		if (!api) {
			return;
		}

		setCurrent(api.selectedScrollSnap() + 1);

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});

		api.on("init", () => {
			api.scrollTo(0);
		});
	}, [api]);

	return (
		<div className="mx-auto max-w-xs">
			<Carousel
				setApi={setApi}
				className="w-full max-w-xs min-w-xs"
				plugins={[
					Autoplay({
						delay: 2000,
					}),
				]}>
				<CarouselContent>
					{isLoading && <Illustration type="loading" className="m-auto" />}
					{Array.isArray(items) &&
						items?.slice(0, 10)?.map((item, index) => (
							<CarouselItem key={index}>
								<Card>
									<CardContent className="flex aspect-square items-center justify-center p-0">
										<Image
											src={item.image[0]}
											alt={item.title}
											width={250}
											height={250}
											className="rounded-md"
										/>
									</CardContent>
								</Card>
							</CarouselItem>
						))}

					{!Array.isArray(items) &&
						items?.image.slice(0, 10)?.map((image, index) => (
							<CarouselItem key={index}>
								<Card>
									<CardContent className="flex aspect-square items-center justify-center p-0">
										<Image
											src={image}
											alt={image}
											width={250}
											height={250}
											className="rounded-md"
										/>
									</CardContent>
								</Card>
							</CarouselItem>
						))}
				</CarouselContent>
				{controls && (
					<>
						<CarouselPrevious />
						<CarouselNext />
					</>
				)}
			</Carousel>
			<div className="py-2 text-center text-sm text-muted-foreground">
				{current} of{" "}
				{Array.isArray(items) ? items?.slice(0, 10)?.length : items?.image?.length}
			</div>
		</div>
	);
};
