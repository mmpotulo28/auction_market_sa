"use client";
import styles from "./account.module.css";
import CopyElement from "@/components/CopyElement";
import { Card, CardHeader } from "@/components/ui/card";
import { useAccountContext } from "@/context/AccountContext";
import { useAuth, useUser } from "@clerk/nextjs";
import { logger } from "@sentry/nextjs";
import { Bell, CreditCard, LogOut, Receipt, User2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const QuickActions = [
	{
		icon: Receipt,
		label: "Orders",
		navigateTo: "/account/orders",
	},
	{
		icon: CreditCard,
		label: "Transactions",
		navigateTo: "/account/transactions",
	},
	{
		icon: Bell,
		label: "Notifications",
		navigateTo: "/account/notifications",
	},
];

interface iAccountData {
	notifications: {
		id: string;
		label: string;
		subLabel: string;
		date: string;
	}[];
	orders: {
		id: string;
		label: string;
		subLabel: string;
		date: string;
	}[];
	transactions: {
		id: string;
		label: string;
		subLabel: string;
		date: string;
	}[];
}

const AccountCards = [
	{
		icon: User2,
		label: "Notifications",
		dataKey: "notifications",
		navigateTo: "/account/notifications",
	},
	{
		icon: Receipt,
		label: "Orders",
		dataKey: "orders",
		navigateTo: "/account/orders",
	},
	{
		icon: CreditCard,
		label: "Transactions",
		dataKey: "transactions",
		navigateTo: "/account/transactions",
	},
];

const AccountScreen = () => {
	const { user } = useUser();
	const {
		orders,
		transactions,
		notifications,
		errorNotifications,
		errorOrders,
		errorTransactions,
	} = useAccountContext();

	const data: iAccountData = {
		notifications: notifications?.map((notification) => ({
			id: notification.id,
			label: notification.message,
			subLabel: notification.type,
			date: notification.created_at
				? new Date(notification.created_at).toLocaleString()
				: "-",
		})),
		orders: orders?.map((order) => ({
			id: order.order_id,
			label: order.order_id,
			subLabel: `R${order.total_amount} - ${order.order_status}`,
			date: order.created_at ? new Date(order.created_at).toLocaleString() : "-",
		})),
		transactions: transactions?.map((tx) => ({
			id: tx.pf_payment_id as string,
			label: tx.m_payment_id as string,
			subLabel: tx.payment_status as string,
			date: tx.created_at ? new Date(tx.created_at).toLocaleString() : ("-" as string),
		})),
	};

	const { signOut } = useAuth();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await signOut();
			// Optionally clear AsyncStorage or any other app state here
			router.replace("/(auth)/sign-in");
		} catch (e) {
			logger.error("Logout error:", { e });
			toast.error("Error: Failed to log out.");
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				{/* Left Sidebar */}
				<div className={styles.sidebar}>
					{/* Profile Card */}
					<Card className={styles.profileCard}>
						<CardHeader className={styles.profileHeader}>
							{user?.imageUrl ? (
								<Image
									width={80}
									height={80}
									src={user.imageUrl}
									className={styles.avatar}
									alt="user avatar"
								/>
							) : (
								<div className={styles.avatarPlaceholder}>
									<User2 size={32} />
								</div>
							)}
							<div className={styles.profileInfo}>
								<h2 className={styles.profileName}>
									{user?.fullName || "Your Name"}
								</h2>
								<p className={styles.profileEmail}>
									{user?.primaryEmailAddress?.emailAddress || "your@email.com"}
								</p>
							</div>
						</CardHeader>
						<button
							className={styles.editProfileBtn}
							onClick={() => router.push("/account/profile")}>
							Edit Profile
						</button>
					</Card>

					{/* Quick Actions */}
					<Card className={styles.quickActionsCard}>
						<CardHeader>
							<h3 className={styles.cardTitle}>Quick Actions</h3>
						</CardHeader>
						<div className={styles.quickActions}>
							{QuickActions.map((action) => (
								<button
									key={action.label}
									className={styles.actionCard}
									onClick={() => router.push(action.navigateTo as any)}>
									<action.icon size={20} className={styles.actionIcon} />
									<span className={styles.actionLabel}>{action.label}</span>
								</button>
							))}
						</div>
					</Card>

					{/* Logout */}
					<button className={styles.logoutBtn} onClick={handleLogout}>
						<LogOut size={18} />
						<span>Sign Out</span>
					</button>
				</div>

				{/* Main Content */}
				<div className={styles.mainContent}>
					{/* Error Messages */}
					{(errorNotifications || errorOrders || errorTransactions) && (
						<div className={styles.errorSection}>
							{errorNotifications && (
								<div className={styles.errorCard}>
									<span className={styles.errorText}>{errorNotifications}</span>
								</div>
							)}
							{errorOrders && (
								<div className={styles.errorCard}>
									<span className={styles.errorText}>{errorOrders}</span>
								</div>
							)}
							{errorTransactions && (
								<div className={styles.errorCard}>
									<span className={styles.errorText}>{errorTransactions}</span>
								</div>
							)}
						</div>
					)}

					{/* Activity Cards */}
					<div className={styles.activityGrid}>
						{AccountCards?.map((card) => (
							<Card key={card.dataKey} className={styles.activityCard}>
								<div className={styles.activityHeader}>
									<div className={styles.activityTitleRow}>
										<card.icon size={24} className={styles.activityIcon} />
										<h3 className={styles.activityTitle}>
											Recent {card.label}
										</h3>
									</div>
									<button
										onClick={() => router.push(card.navigateTo as any)}
										className={styles.viewAllBtn}>
										View All
									</button>
								</div>
								<div className={styles.activityList}>
									{data[card.dataKey as keyof iAccountData]?.length > 0 ? (
										data[card.dataKey as keyof iAccountData]
											?.slice(0, 4)
											?.map((item, index) => (
												<div
													key={`${item.id}-${index}`}
													className={styles.activityItem}>
													<div className={styles.activityItemContent}>
														<div className={styles.activityItemMain}>
															<CopyElement
																truncate
																content={item.label}
															/>
														</div>
														<div className={styles.activityItemSub}>
															{item.subLabel}
														</div>
													</div>
													<div className={styles.activityItemDate}>
														{item.date}
													</div>
												</div>
											))
									) : (
										<div className={styles.activityEmpty}>
											<div className={styles.emptyIcon}>
												<card.icon size={32} />
											</div>
											<p className={styles.emptyText}>
												No recent {card.label.toLowerCase()} found
											</p>
										</div>
									)}
								</div>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AccountScreen;
