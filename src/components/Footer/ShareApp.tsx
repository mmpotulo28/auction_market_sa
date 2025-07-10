"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, Twitter, Copy } from "lucide-react";

const appTitle = "Auction Market SA";
const shareUrl =
	typeof window !== "undefined" ? window.location.href : "https://auctionmarket.tech";

const shareLinks = [
	{
		name: "Facebook",
		url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
		icon: <Facebook className="w-5 h-5" />,
	},
	{
		name: "LinkedIn",
		url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
			shareUrl,
		)}&title=${encodeURIComponent(appTitle)}`,
		icon: <Linkedin className="w-5 h-5" />,
	},
	{
		name: "Twitter",
		url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
			shareUrl,
		)}&text=${encodeURIComponent(appTitle)}`,
		icon: <Twitter className="w-5 h-5" />,
	},
];

function copyToClipboard() {
	if (typeof window !== "undefined" && navigator.clipboard) {
		navigator.clipboard.writeText(window.location.href);
	}
}

const ShareApp = () => (
	<div className="flex flex-col md:flex-row md:justify-end md:items-center gap-2 my-6">
		<span className="text-sm font-medium text-muted-foreground md:mr-3">Share this app:</span>
		<div className="flex gap-2">
			{shareLinks.map((link) => (
				<Button
					key={link.name}
					asChild
					variant="outline"
					size="icon"
					className="rounded-full"
					aria-label={`Share on ${link.name}`}>
					<a href={link.url} target="_blank" rel="noopener noreferrer">
						{link.icon}
					</a>
				</Button>
			))}
			<Button
				variant="outline"
				size="icon"
				className="rounded-full"
				aria-label="Copy link"
				onClick={copyToClipboard}
				type="button">
				<Copy className="w-5 h-5" />
			</Button>
		</div>
	</div>
);

export default ShareApp;
