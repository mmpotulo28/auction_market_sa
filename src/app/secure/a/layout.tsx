"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import styles from "./layout.module.css";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<SidebarProvider>
			<div className={styles.dashboardContainer}>
				<DashboardSidebar />
				<main className={styles.mainContent}>{children}</main>
			</div>
		</SidebarProvider>
	);
};

export default DashboardLayout;
