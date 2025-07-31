"use client";

import React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import styles from "./dashboard-sidebar.module.css";
import { Home, Settings, Box, Gavel, ReceiptText, Bell } from "lucide-react";
import Link from "next/link";
import { BiEnvelope } from "react-icons/bi";

const DashboardSidebar: React.FC = () => {
	// Menu items.
	const items = [
		{
			title: "Dashboard",
			url: "/secure/a/dashboard",
			icon: Home,
		},
		{
			title: "Items",
			url: "/secure/a/items",
			icon: Box,
		},
		{
			title: "Auctions",
			url: "/secure/a/auctions",
			icon: Gavel,
		},
		{
			title: "Transactions",
			url: "/secure/a/transactions",
			icon: ReceiptText,
		},
		{
			title: "Orders",
			url: "/secure/a/orders",
			icon: ReceiptText,
		},
		{
			title: "Ads",
			url: "/secure/a/ads",
			icon: Box,
		},
		{
			title: "Notifications",
			url: "/secure/a/notifications",
			icon: Bell,
		},
		{
			title: "Emails",
			url: "/secure/a/emails",
			icon: BiEnvelope,
		},
		{
			title: "Settings",
			url: "#",
			icon: Settings,
		},
		{
			title: "Requested Items",
			url: "/secure/a/requested-items",
			icon: Box, // You can use a different icon if you prefer
		},
	];

	return (
		<Sidebar variant="floating" className={styles.sidebar}>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};

export default DashboardSidebar;
