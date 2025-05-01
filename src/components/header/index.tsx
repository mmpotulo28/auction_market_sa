"use client";
import * as React from "react";
import Link from "next/link";
import styles from "./header.module.css";

import { cn } from "@/lib/utils";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { UserButton } from "@stackframe/stack";
import Image from "next/image";

const Header = () => {
	return (
		<header className={styles.header}>
			{/* left side content */}
			<div className={styles.logoContainer}>
				<Image src="/images/amsa-logo.png" alt="Logo" width={100} height={50} />
			</div>

			{/* center content */}
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Marketplace</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
								<li className="row-span-3">
									<NavigationMenuLink asChild>
										<Link
											className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
											href="/">
											<div className="mb-2 mt-4 text-lg font-medium">
												Action Market SA
											</div>
											<p className="text-sm leading-tight text-muted-foreground">
												A real-time auction marketplace for buying and
												selling items.
											</p>
										</Link>
									</NavigationMenuLink>
								</li>
								<ListItem href="/docs" title="How It Works">
									Learn how to list items and participate in auctions.
								</ListItem>
								<ListItem href="/docs/installation" title="Getting Started">
									Steps to create your account and start using the platform.
								</ListItem>
								<ListItem href="/docs/primitives/typography" title="FAQs">
									Find answers to common questions about the platform.
								</ListItem>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Features</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
								<ListItem
									title="Real-Time Updates"
									href="/features/real-time-updates">
									Stay updated with live item availability and auction status.
								</ListItem>
								<ListItem title="User Profiles" href="/features/user-profiles">
									Manage your listings and purchases in one place.
								</ListItem>
								<ListItem title="Admin Dashboard" href="/features/admin-dashboard">
									Admins can manage users, items, and transactions securely.
								</ListItem>
								<ListItem
									title="Secure Transactions"
									href="/features/secure-transactions">
									Ensure safe and reliable payments for all users.
								</ListItem>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Categories</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
								<ListItem title="Electronics" href="/categories/electronics">
									Explore gadgets, devices, and more.
								</ListItem>
								<ListItem title="Fashion" href="/categories/fashion">
									Discover clothing, accessories, and footwear.
								</ListItem>
								<ListItem title="Home & Garden" href="/categories/home-garden">
									Find furniture, decor, and gardening tools.
								</ListItem>
								<ListItem title="Vehicles" href="/categories/vehicles">
									Browse cars, bikes, and other vehicles.
								</ListItem>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Support</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
								<ListItem title="Contact Us" href="/support/contact">
									Get in touch with our support team.
								</ListItem>
								<ListItem title="Help Center" href="/support/help-center">
									Find guides and troubleshooting tips.
								</ListItem>
								<ListItem title="Terms & Policies" href="/support/terms">
									Read our terms of service and privacy policy.
								</ListItem>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/about" legacyBehavior passHref>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								About Us
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			{/* right side content */}
			<UserButton />
		</header>
	);
};

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
	({ className, title, children, ...props }, ref) => {
		return (
			<li>
				<NavigationMenuLink asChild>
					<Link
						ref={ref}
						href={"#"}
						className={cn(
							"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
							className,
						)}
						{...props}>
						<div className="text-sm font-medium leading-none">{title}</div>
						<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
							{children}
						</p>
					</Link>
				</NavigationMenuLink>
			</li>
		);
	},
);
ListItem.displayName = "ListItem";

export default Header;
