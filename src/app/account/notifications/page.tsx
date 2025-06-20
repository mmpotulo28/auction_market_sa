"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Bell, Info, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import Container from "@/components/common/container";
import axios from "axios";
import Illustration from "@/components/Illustration";

// Add type for notification
interface Notification {
	id: string;
	message: string;
	type: string;
	read: boolean;
	created_at?: string;
	user_id?: string;
}

const typeIcon = {
	info: <Info className="text-blue-500" />,
	warning: <AlertTriangle className="text-yellow-500" />,
	error: <XCircle className="text-red-500" />,
	success: <CheckCircle2 className="text-green-500" />,
	default: <Bell className="text-gray-400" />,
};

const typeBorder = {
	info: "border-l-4 border-blue-400",
	warning: "border-l-4 border-yellow-400",
	error: "border-l-4 border-red-400",
	success: "border-l-4 border-green-400",
	default: "border-l-4 border-gray-300",
};

const typeBg = {
	info: "bg-blue-50 dark:bg-blue-900/30",
	warning: "bg-yellow-50 dark:bg-yellow-900/20",
	error: "bg-red-50 dark:bg-red-900/20",
	success: "bg-green-50 dark:bg-green-900/20",
	default: "bg-muted",
};

export default function NotificationsPage() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchNotifications = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await axios.get<{ notifications: Notification[]; error?: string }>(
				"/api/account/notifications",
			);
			const data = res.data;
			if (data.notifications) setNotifications(data.notifications);
			else setError(data.error || "No notifications found.");
		} catch (e: unknown) {
			if (axios.isAxiosError(e)) {
				setError(e.response?.data?.error || e.message);
			} else {
				setError("An unexpected error occurred.");
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNotifications();
	}, []);

	const markAsRead = async (id: string) => {
		try {
			setLoading(true);
			const { data } = await axios.patch<{ success: boolean; error?: string }>(
				"/api/account/notifications",
				{
					id,
				},
			);
			if (data.success) {
				console.log(data);
				setNotifications((prev) =>
					prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
				);
			} else {
				setError(data.error || "Failed to mark notification as read.");
			}
		} catch (e: unknown) {
			if (axios.isAxiosError(e)) {
				setError(e.response?.data?.error || e.message);
			} else {
				setError("Failed to mark notification as read.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container>
			<div className="mx-auto py-10 px-4">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold flex items-center gap-2">
						<Bell className="w-6 h-6 text-accent" /> Notifications
					</h1>
					<Button
						variant="ghost"
						size="icon"
						onClick={fetchNotifications}
						title="Refetch notifications">
						<RotateCcw className="w-5 h-5" />
					</Button>
				</div>
				{error && (
					<Alert variant="destructive" className="mb-6">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				<Card className="overflow-x-auto px-4">
					<ul className="divide-y">
						{loading ? (
							<Illustration type="loading" className="m-auto" />
						) : notifications.length === 0 ? (
							<li className="p-4 text-center">No notifications found.</li>
						) : (
							notifications.map((n) => {
								const border =
									typeBorder[n.type as keyof typeof typeBorder] ||
									typeBorder.default;
								const bg = typeBg[n.type as keyof typeof typeBg] || typeBg.default;
								return (
									<li
										key={n.id}
										className={`flex items-center gap-3 p-5 transition-colors rounded-lg my-2 shadow-sm group
											${border} ${bg}
											${n.read ? "opacity-60" : "hover:bg-accent/10"}
										`}
										style={{
											boxShadow: n.read
												? "none"
												: "0 2px 8px 0 rgba(1,75,139,0.07)",
											borderLeftWidth: 6,
										}}>
										<span className="flex-shrink-0 scale-110">
											{typeIcon[n.type as keyof typeof typeIcon] ||
												typeIcon.default}
										</span>
										<div className="flex-1">
											<div className="font-medium text-lg flex items-center gap-2">
												{n.message}
												{n.read && (
													<CheckCircle2 className="w-4 h-4 text-green-400" />
												)}
											</div>
											<div className="text-xs text-muted-foreground mt-1">
												{n.created_at
													? new Date(n.created_at).toLocaleString()
													: "-"}
											</div>
										</div>
										{!n.read && (
											<Button
												size="sm"
												variant="outline"
												className="transition group-hover:border-accent group-hover:text-accent"
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
		</Container>
	);
}
