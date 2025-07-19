"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import styles from "./CustomerAd.module.css";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export type AdVariant = "banner" | "card-small" | "card-big";

export interface AdSlide {
	id?: string;
	variant: AdVariant;
	title: string;
	description: string;
	imageUrl: string;
	linkUrl: string;
	cta: string;
}

interface CustomerAdProps {
	className?: string;
	apiUrl?: string;
	variant?: AdVariant; // Optionally force a variant
}

const fallbackSlides: AdSlide[] = [
	{
		variant: "card-big",
		title: "Advertise Here!",
		description:
			"Promote your business or product to thousands of auction users. Contact us for special rates.",
		imageUrl: "/images/ad-card-big.jpeg",
		linkUrl: "https://your-ad-link.com",
		cta: "Advertise Now",
	},
	{
		variant: "card-small",
		title: "Get 10% Off Your Next Bid!",
		description: "Use code AUCTION10 at checkout. Limited time only.",
		imageUrl: "/images/ad-discount.jpeg",
		linkUrl: "https://your-ad-link.com/discount",
		cta: "Use Code",
	},
	{
		variant: "banner",
		title: "Featured Seller: TechZone",
		description: "Exclusive electronics deals from TechZone. Shop now and save.",
		imageUrl: "/images/ad-techzone.jpeg",
		linkUrl: "https://your-ad-link.com/techzone",
		cta: "Shop TechZone",
	},
];

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export const CustomerAd: React.FC<CustomerAdProps> = ({
	className,
	apiUrl = "/api/ads",
	variant = "card-big",
}) => {
	const [slides, setSlides] = useState<AdSlide[]>(fallbackSlides);
	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(0);

	useEffect(() => {
		if (!api) {
			return;
		}

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});

		api.on("init", () => {
			api.scrollTo(0);
		});
	}, [api]);

	useEffect(() => {
		let isMounted = true;
		(async () => {
			try {
				const res = await fetch(apiUrl);
				const data = await res.json();
				if (Array.isArray(data.ads) && data.ads.length > 0 && isMounted) {
					setSlides(shuffle(data.ads));
				} else if (isMounted) {
					setSlides(shuffle(fallbackSlides));
				}
			} catch {
				if (isMounted) setSlides(shuffle(fallbackSlides));
			}
		})();
		return () => {
			isMounted = false;
		};
	}, [apiUrl]);

	const slide = slides[current];
	const adVariant = variant || slide.variant || "card-big";

	console.log(slide.title, current, slides);

	return (
		<Carousel
			className={cn(styles.adRoot, className)}
			setApi={setApi}
			opts={{
				loop: false,
				align: "center",
			}}
			plugins={[
				Autoplay({
					delay: 4000,
				}),
			]}>
			{adVariant === "card-big" && (
				<div className={styles.adCardBig}>
					<Image
						src={slide.imageUrl}
						alt={slide.title}
						width={384}
						height={180}
						className={styles.adImageBig}
					/>
					<div className={styles.adContentBig}>
						<div className={styles.adTitleBig}>{slide.title}</div>
						<div className={styles.adDescriptionBig}>{slide.description}</div>
						<a
							href={slide.linkUrl}
							target="_blank"
							rel="noopener noreferrer"
							className={styles.adCtaBig}>
							{slide.cta}
						</a>
					</div>
				</div>
			)}
			{adVariant === "card-small" && (
				<div className={styles.adCardSmall}>
					<Image
						src={slide.imageUrl}
						alt={slide.title}
						width={256}
						height={100}
						className={styles.adImageSmall}
					/>
					<div className={styles.adContentSmall}>
						<div className={styles.adTitleSmall}>{slide.title}</div>
						<div className={styles.adDescriptionSmall}>{slide.description}</div>
						<a
							href={slide.linkUrl}
							target="_blank"
							rel="noopener noreferrer"
							className={styles.adCtaSmall}>
							{slide.cta}
						</a>
					</div>
				</div>
			)}
			{adVariant === "banner" && (
				<CarouselContent className={"w-full max-w-md min-w-full rounded-md"}>
					{slides.map((slide, index) => (
						<CarouselItem key={index} className={styles.adBanner}>
							<Image
								src={slide.imageUrl}
								alt={slide.title}
								width={120}
								height={80}
								className={styles.adBannerImage}
							/>
							<div className={styles.adBannerContent}>
								<div className={styles.adBannerTitle}>{slide.title}</div>
								<div className={styles.adBannerDescription}>
									{slide.description}
								</div>
								<a href={slide.linkUrl} className={styles.adBannerCta}>
									{slide.cta}
								</a>
							</div>
							<Image
								src={slide.imageUrl}
								alt={slide.title}
								width={120}
								height={80}
								className={styles.adBannerImage}
							/>
						</CarouselItem>
					))}
				</CarouselContent>
			)}
			<div className={styles.adDots}>
				{slides.map((_, idx) => (
					<button
						key={idx}
						className={cn(styles.adDot, idx === current ? styles.adDotActive : "")}
						style={{ opacity: idx === current ? 1 : 0.5 }}
						onClick={() => setCurrent(idx)}
						aria-label={`Go to slide ${idx + 1}`}
					/>
				))}
			</div>
		</Carousel>
	);
};

export default CustomerAd;
