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
} from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Send, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminToUserEmailTemplate } from "@/lib/email_templates";
import axios from "axios";

interface Email {
	id: number;
	from_email: string;
	to_email: string;
	subject: string;
	body: string;
	status: string;
	date_sent: string;
}

export default function AdminEmailsPage() {
	const [emails, setEmails] = useState<Email[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showCompose, setShowCompose] = useState(false);
	const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
	const [sending, setSending] = useState(false);
	const [form, setForm] = useState({
		to: "",
		subject: "",
		message: "",
		userName: "",
		adminName: "Auction Market Admin",
	});

	const fetchEmails = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await axios.get<{ data: Email[]; error?: string }>("/api/admin/emails");
			if (res.data.data) setEmails(res.data.data);
			else setError(res.data.error || "No emails found.");
		} catch (e: any) {
			setError(e?.message || "Failed to fetch emails.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchEmails();
	}, []);

	const handleSend = async (e: React.FormEvent) => {
		e.preventDefault();
		setSending(true);
		try {
			const html = adminToUserEmailTemplate({
				adminName: form.adminName,
				userName: form.userName,
				subject: form.subject,
				message: form.message,
			});
			const { data } = await axios.post(
				"/api/email/send",
				{
					to: form.to,
					from: "support@auctionmarket.tech",
					subject: form.subject,
					html,
					text: form.message,
				},
				{
					headers: {
						Authorization: `Bearer ${process.env.NEXT_PUBLIC_EMAIL_API_KEY || ""}`,
					},
				},
			);
			if (data.success) {
				toast.success("Email sent!");
				setShowCompose(false);
				setForm({
					to: "",
					subject: "",
					message: "",
					userName: "",
					adminName: "Auction Market Admin",
				});
				fetchEmails();
			} else {
				toast.error(data.error || "Failed to send email.");
			}
		} catch (err: any) {
			toast.error(err?.response?.data?.error || err?.message || "Failed to send email.");
		}
		setSending(false);
	};

	return (
		<div className="max-w-5xl mx-auto py-10 px-4">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold flex items-center gap-2">
					<Mail className="text-accent" /> Admin Emails
				</h1>
				<Button onClick={() => setShowCompose(true)}>
					<Send className="mr-2" /> Compose Email
				</Button>
			</div>
			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<Card className="overflow-x-auto p-0 mb-10">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>To</TableHead>
							<TableHead>Subject</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Preview</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center">
									<Loader2 className="animate-spin mx-auto" />
								</TableCell>
							</TableRow>
						) : emails.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center">
									No emails found.
								</TableCell>
							</TableRow>
						) : (
							emails.map((email) => (
								<TableRow key={email.id}>
									<TableCell>
										{email.date_sent
											? new Date(email.date_sent).toLocaleString()
											: "-"}
									</TableCell>
									<TableCell>{email.to_email}</TableCell>
									<TableCell>{email.subject}</TableCell>
									<TableCell>
										<span
											className={
												email.status === "SENT"
													? "text-green-600"
													: "text-red-600"
											}>
											{email.status}
										</span>
									</TableCell>
									<TableCell>
										<Dialog>
											<DialogTrigger asChild>
												<Button
													variant="outline"
													size="sm"
													onClick={() => setSelectedEmail(email)}>
													View
												</Button>
											</DialogTrigger>
											{selectedEmail && selectedEmail.id === email.id && (
												<DialogContent className=" max-h-[90%] overflow-x-auto">
													<div
														className="prose max-w-full"
														dangerouslySetInnerHTML={{
															__html: selectedEmail.body,
														}}
													/>
												</DialogContent>
											)}
										</Dialog>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Card>
			<Dialog open={showCompose} onOpenChange={setShowCompose}>
				<DialogContent>
					<DialogTitle>Compose Email</DialogTitle>
					<form onSubmit={handleSend} className="flex flex-col gap-4">
						<Input
							type="email"
							placeholder="Recipient Email"
							value={form.to}
							onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
							required
						/>
						<Input
							type="text"
							placeholder="Recipient Name (optional)"
							value={form.userName}
							onChange={(e) => setForm((f) => ({ ...f, userName: e.target.value }))}
						/>
						<Input
							type="text"
							placeholder="Subject"
							value={form.subject}
							onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
							required
						/>
						<Textarea
							placeholder="Message"
							value={form.message}
							onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
							rows={6}
							required
						/>
						<Button type="submit" disabled={sending}>
							{sending ? (
								<Loader2 className="animate-spin mr-2" />
							) : (
								<Send className="mr-2" />
							)}
							Send Email
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
