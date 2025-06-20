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
	const [form, setForm] = useState({ user_id: "", message: "", type: "info", admin_only: false });
	const [creating, setCreating] = useState(false);

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
			setForm({ user_id: "", message: "", type: "info", admin_only: false });
			fetchNotifications();
		} else {
			toast.error(data.error || "Failed to create notification");
		}
		setCreating(false);
	};

	return (
		<div className="max-w-3xl mx-auto py-10 px-4">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold flex items-center gap-2">
					<Bell className="w-7 h-7 text-accent" /> Admin Notifications
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
			<Card className="overflow-x-auto p-0 mb-8">
				<Table>
					<TableCaption>All notifications</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Type</TableHead>
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
						) : notifications.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center">
									No notifications found.
								</TableCell>
							</TableRow>
						) : (
							notifications.map((n) => (
								<TableRow key={n.id}>
									<TableCell>
										{typeIcon[n.type as keyof typeof typeIcon] ||
											typeIcon.default}
									</TableCell>
									<TableCell>{n.message}</TableCell>
									<TableCell>
										{n.user_id ? (
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
									<TableCell>{n.read ? "Yes" : "No"}</TableCell>
									<TableCell>
										<Button
											variant="destructive"
											size="icon"
											onClick={() => handleDelete(n.id)}>
											<Trash2 className="w-4 h-4" />
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Card>
			<form
				onSubmit={handleCreate}
				className="bg-muted rounded-lg p-6 flex flex-col gap-4 shadow">
				<h2 className="text-xl font-semibold mb-2">Create Notification</h2>
				<div className="flex flex-col md:flex-row gap-4">
					<input
						className="border rounded px-3 py-2 flex-1"
						placeholder="User ID (leave blank for all users)"
						value={form.user_id}
						onChange={(e) => setForm((f) => ({ ...f, user_id: e.target.value }))}
					/>
					<input
						className="border rounded px-3 py-2 flex-1"
						placeholder="Message"
						required
						value={form.message}
						onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
					/>
					<select
						className="border rounded px-3 py-2"
						value={form.type}
						onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
						<option value="info">Info</option>
						<option value="success">Success</option>
						<option value="warning">Warning</option>
						<option value="error">Error</option>
					</select>
					<label className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={form.admin_only}
							onChange={(e) =>
								setForm((f) => ({ ...f, admin_only: e.target.checked }))
							}
						/>
						<span>Admin Only</span>
					</label>
				</div>
				<Button type="submit" disabled={creating} className="mt-2 w-fit">
					{creating ? "Creating..." : "Create Notification"}
				</Button>
			</form>
		</div>
	);
}
