"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Bell, Info, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import Container from "@/components/common/container";
import Illustration from "@/components/Illustration";
import { Switch } from "@/components/ui/switch";
import { CustomerAd } from "@/components/ads/CustomerAd";
import styles from "./notifications.module.css";
import { CarouselDApiSlider } from "@/components/TopBanner/slider";
import { useWebSocket } from "@/context/WebSocketProvider";
import { typeBg, typeBorder } from "@/lib/types";
import { useAccountContext } from "@/context/AccountContext";

const typeIcon = {
	info: <Info className="text-blue-500" />,
	warning: <AlertTriangle className="text-yellow-500" />,
	error: <XCircle className="text-red-500" />,
	success: <CheckCircle2 className="text-green-500" />,
	default: <Bell className="text-gray-400" />,
};

export default function NotificationsPage() {
	const {
		notifications,
		readNotification: markAsRead,
		errorNotifications,
		loadingNotifications,
		fetchNotifications,
	} = useAccountContext();
	const [showOld, setShowOld] = useState(false);
	const { items } = useWebSocket();

	// Filter notifications based on switch
	const now = Date.now();
	const filteredNotifications = notifications.filter((n) => {
		const created = n.created_at ? new Date(n.created_at).getTime() : 0;
		const isOld = n.read && now - created > 5 * 60 * 1000;
		const isNew = !isOld;
		return showOld ? isOld : isNew;
	});

	return (
		<Container>
			<div className={styles.notificationsRoot}>
				<div className={styles.notificationsLayout}>
					<div className={styles.notificationsMain}>
						<div className={styles.notificationsHeader}>
							<h1 className={styles.notificationsTitle}>
								<Bell className={styles.notificationsTitleIcon} /> Notifications
							</h1>
							<div className={styles.notificationsHeaderControls}>
								<label className={styles.notificationsSwitchLabel}>
									<Switch
										checked={showOld}
										onCheckedChange={setShowOld}
										id="show-old-notifications"
									/>
									<span>{showOld ? "Show Old" : "Show New"}</span>
								</label>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => fetchNotifications()}
									title="Refetch notifications"
									className={styles.notificationsRefreshBtn}>
									<RotateCcw className="w-5 h-5" />
								</Button>
							</div>
						</div>
						{errorNotifications && (
							<Alert variant="destructive" className={styles.notificationsAlert}>
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>{errorNotifications}</AlertDescription>
							</Alert>
						)}
						<Card className={styles.notificationsCard}>
							<ul className={styles.notificationsList}>
								{loadingNotifications ? (
									<Illustration
										type="loading"
										className={styles.notificationsLoading}
									/>
								) : filteredNotifications.length === 0 ? (
									<li className={styles.notificationsEmpty}>
										No notifications found.
									</li>
								) : (
									filteredNotifications.map((n) => {
										const border =
											typeBorder[n.type as keyof typeof typeBorder] ||
											typeBorder.default;
										const bg =
											typeBg[n.type as keyof typeof typeBg] || typeBg.default;
										return (
											<li
												key={n.id}
												className={`${
													styles.notificationItem
												} ${border} ${bg} ${
													n.read
														? styles.notificationRead
														: styles.notificationUnread
												}`}>
												<span className={styles.notificationIcon}>
													{typeIcon[n.type as keyof typeof typeIcon] ||
														typeIcon.default}
												</span>
												<div className={styles.notificationContent}>
													<div className={styles.notificationMessage}>
														<span>{n.message}</span>
														{n.read && (
															<CheckCircle2
																className={
																	styles.notificationReadIcon
																}
															/>
														)}
													</div>
													<div className={styles.notificationDate}>
														{n.created_at
															? new Date(
																	n.created_at,
															  ).toLocaleString()
															: "-"}
													</div>
												</div>
												{!n.read && (
													<Button
														size="sm"
														variant="outline"
														className={styles.notificationMarkReadBtn}
														onClick={() => markAsRead(n.id)}>
														Mark as read
													</Button>
												)}
											</li>
										);
									})
								)}
							</ul>
						</Card>
					</div>
					<div className={styles.notificationsAd}>
						<CarouselDApiSlider items={items} controls={false} />
					</div>
				</div>
				<CustomerAd variant="banner" />
			</div>
		</Container>
	);
}
