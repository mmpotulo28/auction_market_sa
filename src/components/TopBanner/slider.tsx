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

export function CarouselDApiSlider() {
	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(0);
	const [count, setCount] = React.useState(0);

	React.useEffect(() => {
		if (!api) {
			return;
		}

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
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
					{Array.from({ length: 5 }).map((_, index) => (
						<CarouselItem key={index}>
							<Card>
								<CardContent className="flex aspect-square items-center justify-center p-6">
									<Image
										src={`/images/amsa-logo.png`}
										alt="Random Image"
										width={200}
										height={200}
										className="rounded-md"
									/>
								</CardContent>
							</Card>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
			<div className="py-2 text-center text-sm text-muted-foreground">
				{current} of {count}
			</div>
		</div>
	);
}
