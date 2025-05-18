"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import PermissionDenied from "@/components/PermissionDenied";
import styles from "./layout.module.css";
import { Protect, useUser } from "@clerk/nextjs";

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
					<main className={styles.mainContent}>{children}</main>
				</div>
			</SidebarProvider>
		</Protect>
	);
};

export default DashboardLayout;
