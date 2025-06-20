"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Bell, Info, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const typeIcon = {
	info: <Info className="text-blue-500" />,
	warning: <AlertTriangle className="text-yellow-500" />,
	error: <XCircle className="text-red-500" />,
	success: <CheckCircle2 className="text-green-500" />,
	default: <Bell className="text-gray-400" />,
};

export default function NotificationsPage() {
	const [notifications, setNotifications] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchNotifications = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/account/notifications");
			const data = await res.json();
			if (data.notifications) setNotifications(data.notifications);
			else setError(data.error || "No notifications found.");
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNotifications();
	}, []);

	const markAsRead = async (id: string) => {
		await fetch("/api/account/notifications", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});
		setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
	};

	return (
		<div className="max-w-xl mx-auto py-10 px-4">
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
			<Card className="overflow-x-auto p-0">
				<ul className="divide-y">
					{loading ? (
						<li className="p-4 text-center">Loading...</li>
					) : notifications.length === 0 ? (
						<li className="p-4 text-center">No notifications found.</li>
					) : (
						notifications.map((n) => (
							<li
								key={n.id}
								className={`flex items-center gap-3 p-4 transition-colors ${
									n.read ? "opacity-60" : "bg-blue-50 dark:bg-blue-900/30"
								}`}>
								<span className="flex-shrink-0">
									{typeIcon[n.type as keyof typeof typeIcon] || typeIcon.default}
								</span>
								<div className="flex-1">
									<div className="font-medium">{n.message}</div>
									<div className="text-xs text-muted-foreground">
										{n.created_at
											? new Date(n.created_at).toLocaleString()
											: "-"}
									</div>
								</div>
								{!n.read && (
									<Button
										size="sm"
										variant="outline"
										onClick={() => markAsRead(n.id)}>
										Mark as read
									</Button>
								)}
							</li>
						))
					)}
				</ul>
			</Card>
		</div>
	);
}
