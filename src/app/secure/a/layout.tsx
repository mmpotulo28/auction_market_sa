"use client";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import PermissionDenied from "@/components/PermissionDenied";
import styles from "./layout.module.css";
import { Protect, useUser } from "@clerk/nextjs";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user } = useUser();

	return (
		<Protect
			fallback={<PermissionDenied />}
			condition={() =>
				!!user?.organizationMemberships?.some(
					(membership) => membership.role === "org:admin",
				)
			}>
			<SidebarProvider>
				<div className={styles.dashboardContainer}>
					<DashboardSidebar />
					<main className={styles.mainContent}>
						<SidebarTrigger variant={"outline"} />
						{children}
					</main>
				</div>
			</SidebarProvider>
		</Protect>
	);
};

export default DashboardLayout;
