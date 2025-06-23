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
import Image from "next/image";
import { Button } from "../ui/button";
import { CrossIcon } from "lucide-react";
import { FaBars } from "react-icons/fa";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../ToggleTheme";

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
	({ className, title, children, ...props }, ref) => {
		return (
			<li>
				<NavigationMenuLink asChild>
					<Link
						ref={ref}
						href={props.href || "#"}
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

const Header = () => {
	const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);

	return (
		<header className={`${styles.header}`}>
			{/* left side content */}
			<div className="flex items-center justify-between px-4 py-2 md:px-6">
				<div className={styles.logoContainer}>
					<Image src="/images/amsa-logo.png" alt="Logo" width={100} height={50} />
				</div>

				{/* Mobile menu toggle */}
			</div>

			{/* center content */}
			<nav className={`${isMobileMenuOpen ? styles.open : styles.hidden}`}>
				<NavigationMenu>
					<NavigationMenuList className={`${styles.menuList} flex flex-col md:flex-row`}>
						<NavigationMenuItem>
							<NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
								Home
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink
								href="/#features"
								className={navigationMenuTriggerStyle()}>
								Features
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuTrigger>Account</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
									<ListItem title="Account Home" href="/account">
										Overview & quick links
									</ListItem>
									<ListItem title="Profile & Settings" href="/account/profile">
										Manage your profile and preferences
									</ListItem>
									<ListItem title="Order History" href="/account/orders">
										View your orders
									</ListItem>
									<ListItem title="Transactions" href="/account/transactions">
										View your transactions
									</ListItem>
									<ListItem title="Notifications" href="/account/notifications">
										Your notifications
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
									<ListItem title="Terms & Policies" href="/policy/terms">
										Read our terms of service and privacy policy.
									</ListItem>
									<ListItem title="Privacy Policy" href="/policy/privacy">
										Read our privacy policy.
									</ListItem>
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink
								href="/cart"
								className={navigationMenuTriggerStyle()}>
								Cart
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</nav>

			{/* right side content */}
			<div className="flex items-center justify-end space-x-4 gap-2.5">
				<ModeToggle />
				<UserButton />
				<div className={styles.toggleButton}>
					<Button
						variant={"ghost"}
						className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
						onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
						<span className="sr-only">Toggle navigation</span>
						{isMobileMenuOpen ? <CrossIcon /> : <FaBars />}
					</Button>
				</div>
			</div>
		</header>
	);
};

export default Header;
