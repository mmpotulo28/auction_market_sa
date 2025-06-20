"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
	TableCaption,
} from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
	AlertCircle,
	Trash2,
	Bell,
	Info,
	AlertTriangle,
	XCircle,
	CheckCircle2,
	User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";

// Notification type colors and backgrounds
const typeBorder = {
	info: "border-l-4 border-blue-400",
	warning: "border-l-4 border-yellow-400",
	error: "border-l-4 border-red-400",
	success: "border-l-4 border-green-400",
	default: "border-l-4 border-gray-300",
};
const typeBg = {
	info: "bg-blue-50/60 dark:bg-blue-900/20",
	warning: "bg-yellow-50/60 dark:bg-yellow-900/10",
	error: "bg-red-50/60 dark:bg-red-900/10",
	success: "bg-green-50/60 dark:bg-green-900/10",
	default: "bg-muted",
};
const typeIcon = {
	info: <Info className="text-blue-500" />,
	warning: <AlertTriangle className="text-yellow-500" />,
	error: <XCircle className="text-red-500" />,
	success: <CheckCircle2 className="text-green-500" />,
	default: <Bell className="text-gray-400" />,
};

export default function AdminNotificationsPage() {
	const [notifications, setNotifications] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [form, setForm] = useState({
		user_id: "All",
		message: "",
		type: "info",
		admin_only: false,
	});
	const [creating, setCreating] = useState(false);
	const [showAdminOnly, setShowAdminOnly] = useState(false);

	const fetchNotifications = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/admin/notifications");
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

	const handleDelete = async (id: string) => {
		if (!confirm("Delete this notification?")) return;
		const res = await fetch("/api/admin/notifications", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});
		const data = await res.json();
		if (data.success) {
			toast.success("Notification deleted");
			setNotifications((prev) => prev.filter((n) => n.id !== id));
		} else {
			toast.error(data.error || "Failed to delete notification");
		}
	};

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		setCreating(true);
		const res = await fetch("/api/admin/notifications", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});
		const data = await res.json();
		if (data.success) {
			toast.success("Notification created");
			setForm({ user_id: "All", message: "", type: "info", admin_only: false });
			fetchNotifications();
		} else {
			toast.error(data.error || "Failed to create notification");
		}
		setCreating(false);
	};

	// Filter notifications based on toggle
	const displayedNotifications = showAdminOnly
		? notifications.filter((n) => n.admin_only)
		: notifications;

	return (
		<div className="mx-auto py-0 px-4 max-w-6xl">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold flex items-center gap-2">
					<Bell className="w-7 h-7 text-accent" /> Admin Notifications
				</h1>
				<div className="flex items-center gap-4">
					<label className="flex items-center gap-2 text-sm font-medium">
						<Switch
							checked={showAdminOnly}
							onCheckedChange={setShowAdminOnly}
							id="admin-only-toggle"
						/>
						<span>Show Admin Only</span>
					</label>
					<Button
						variant="ghost"
						size="icon"
						onClick={fetchNotifications}
						title="Refetch notifications">
						<RotateCcw className="w-5 h-5" />
					</Button>
				</div>
			</div>
			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<Card className="overflow-x-auto p-0 mb-10 shadow-lg">
				<Table>
					<TableCaption className="text-base font-medium pb-2">
						{showAdminOnly ? "Admin Only Notifications" : "All notifications"}
					</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-12">Type</TableHead>
							<TableHead>Message</TableHead>
							<TableHead>User</TableHead>
							<TableHead>Created</TableHead>
							<TableHead>Read</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center">
									Loading...
								</TableCell>
							</TableRow>
						) : displayedNotifications.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center">
									No notifications found.
								</TableCell>
							</TableRow>
						) : (
							displayedNotifications.map((n) => {
								const border =
									typeBorder[n.type as keyof typeof typeBorder] ||
									typeBorder.default;
								const bg = typeBg[n.type as keyof typeof typeBg] || typeBg.default;
								return (
									<TableRow
										key={n.id}
										className={`transition-all ${border} ${bg} hover:bg-accent/10 group`}
										style={{ borderLeftWidth: 6 }}>
										<TableCell>
											<span className="flex items-center justify-center">
												{typeIcon[n.type as keyof typeof typeIcon] ||
													typeIcon.default}
											</span>
										</TableCell>
										<TableCell>
											<div className="font-medium text-base flex items-center gap-2">
												{n.message}
												{n.admin_only && (
													<span className="ml-2 px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-200">
														Admin Only
													</span>
												)}
											</div>
										</TableCell>
										<TableCell>
											{n.user_id && n.user_id !== "All" ? (
												<span className="flex items-center gap-1">
													<User className="w-4 h-4" />
													{n.user_id}
												</span>
											) : (
												<span className="italic text-muted-foreground">
													All
												</span>
											)}
										</TableCell>
										<TableCell>
											{n.created_at
												? new Date(n.created_at).toLocaleString()
												: "-"}
										</TableCell>
										<TableCell>
											{n.read ? (
												<span className="flex items-center gap-1 text-green-600">
													<CheckCircle2 className="w-4 h-4" /> Read
												</span>
											) : (
												<span className="flex items-center gap-1 text-gray-400">
													<Bell className="w-4 h-4" /> Unread
												</span>
											)}
										</TableCell>
										<TableCell>
											<Button
												variant="destructive"
												size="icon"
												className="transition group-hover:scale-110"
												onClick={() => handleDelete(n.id)}>
												<Trash2 className="w-4 h-4" />
											</Button>
										</TableCell>
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
			</Card>
			<Card className="bg-muted rounded-lg p-8 flex flex-col gap-6 shadow-lg max-w-3xl mx-auto">
				<h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
					<Bell className="w-5 h-5 text-accent" /> Create Notification
				</h2>
				<form onSubmit={handleCreate} className="flex flex-col gap-4">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1 flex flex-col gap-2">
							<label className="text-sm font-medium">User ID</label>
							<input
								className="border rounded px-3 py-2"
								placeholder="User ID (All for everyone)"
								value={form.user_id}
								onChange={(e) =>
									setForm((f) => ({ ...f, user_id: e.target.value }))
								}
							/>
						</div>
						<div className="flex-1 flex flex-col gap-2">
							<label className="text-sm font-medium">Message</label>
							<input
								className="border rounded px-3 py-2"
								placeholder="Message"
								required
								value={form.message}
								onChange={(e) =>
									setForm((f) => ({ ...f, message: e.target.value }))
								}
							/>
						</div>
					</div>
					<div className="flex flex-col md:flex-row gap-4 items-center">
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">Type</label>
							<select
								className="border rounded px-3 py-2"
								value={form.type}
								onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
								<option value="info">Info</option>
								<option value="success">Success</option>
								<option value="warning">Warning</option>
								<option value="error">Error</option>
							</select>
						</div>
						<label className="flex items-center gap-2 mt-4 md:mt-8">
							<input
								type="checkbox"
								checked={form.admin_only}
								onChange={(e) =>
									setForm((f) => ({ ...f, admin_only: e.target.checked }))
								}
							/>
							<span className="text-sm">Admin Only</span>
						</label>
						<Button
							type="submit"
							disabled={creating}
							className="mt-4 md:mt-8 w-fit min-w-[180px]">
							{creating ? "Creating..." : "Create Notification"}
						</Button>
					</div>
				</form>
			</Card>
		</div>
	);
}
