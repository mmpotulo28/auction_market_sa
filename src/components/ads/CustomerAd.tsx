"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
	apiUrl?: string; // Optionally override API endpoint
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
		variant: "card-big",
		title: "Get 10% Off Your Next Bid!",
		description: "Use code AUCTION10 at checkout. Limited time only.",
		imageUrl: "/images/ad-discount.jpeg",
		linkUrl: "https://your-ad-link.com/discount",
		cta: "Use Code",
	},
	{
		variant: "card-big",
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

export const CustomerAd: React.FC<CustomerAdProps> = ({ className, apiUrl = "/api/ads" }) => {
	const [slides, setSlides] = useState<AdSlide[]>(fallbackSlides);
	const [current, setCurrent] = useState(0);

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

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrent((prev) => (prev + 1) % slides.length);
		}, 6000);
		return () => clearInterval(timer);
	}, [slides]);

	const slide = slides[current];

	return (
		<div className={cn("relative transition-all", className)}>
			<a
				href={slide.linkUrl}
				target="_blank"
				rel="noopener noreferrer"
				className={cn(
					"block rounded-xl shadow-xl bg-gradient-to-br from-blue-100 to-blue-300 border border-blue-200 hover:shadow-2xl transition w-96",
					"overflow-hidden",
				)}>
				<Image
					src={slide.imageUrl}
					alt={slide.title}
					width={384}
					height={180}
					className="object-cover rounded-t-xl"
				/>
				<div className="p-5">
					<div className="font-bold text-xl text-blue-900 mb-1">{slide.title}</div>
					<div className="text-sm text-blue-800 mb-3">{slide.description}</div>
					<span className="inline-block px-4 py-2 bg-blue-700 text-white rounded-full text-sm font-semibold hover:bg-blue-800 transition">
						{slide.cta}
					</span>
				</div>
			</a>
			<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
				{slides.map((_, idx) => (
					<button
						key={idx}
						className={cn(
							"h-2 w-2 rounded-full transition-all",
							idx === current ? "bg-blue-700" : "bg-blue-300",
						)}
						style={{ opacity: idx === current ? 1 : 0.5 }}
						onClick={() => setCurrent(idx)}
						aria-label={`Go to slide ${idx + 1}`}></button>
				))}
			</div>
		</div>
	);
};

export default CustomerAd;
