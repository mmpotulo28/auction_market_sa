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

interface iCarouselDApiSlider {
	items: iAuctionItem[];
	controls?: boolean;
}

export const CarouselDApiSlider: React.FC<iCarouselDApiSlider> = ({ items, controls = true }) => {
	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(0);

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
				className="w-full max-w-xs"
				plugins={[
					Autoplay({
						delay: 2000,
					}),
				]}>
				<CarouselContent>
					{items?.slice(0, 10)?.map((item, index) => (
						<CarouselItem key={index}>
							<Card>
								<CardContent className="flex aspect-square items-center justify-center p-0">
									<Image
										src={item.image}
										alt={item.title}
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
				{current} of {items?.slice(0, 10)?.length}
			</div>
		</div>
	);
};
