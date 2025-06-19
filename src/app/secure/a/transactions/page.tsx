"use client";
import { useEffect, useState, useRef } from "react";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye } from "lucide-react";
import axios from "axios";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Receipt from "@/components/Reciept";
import { iTransaction } from "@/lib/types";
import Illustration from "@/components/Illustration";

export default function TransactionsPage() {
	const [transactions, setTransactions] = useState<iTransaction[]>([]);
	const [filtered, setFiltered] = useState<iTransaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [selectedTx, setSelectedTx] = useState<iTransaction | null>(null);
	const receiptRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setLoading(true);
		setError(null);
		axios
			.get("/api/admin/transactions")
			.then((res) => {
				if (res.data && Array.isArray(res.data.transactions)) {
					setTransactions(res.data.transactions);
					setFiltered(res.data.transactions);
				} else {
					setError("Invalid response from server.");
				}
			})
			.catch((e) => {
				let msg = "Failed to fetch transactions.";
				if (e?.response?.data?.error) msg = e.response.data.error;
				else if (e?.message) msg = e.message;
				setError(msg);
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		if (!search) {
			setFiltered(transactions);
			return;
		}
		const s = search.toLowerCase();
		setFiltered(
			transactions.filter(
				(t) =>
					t.m_payment_id?.toLowerCase().includes(s) ||
					t.pf_payment_id.toLowerCase().includes(s) ||
					t.item_name.toLowerCase().includes(s) ||
					t.email_address?.toLowerCase().includes(s) ||
					t.payment_status.toLowerCase().includes(s),
			),
		);
	}, [search, transactions]);

	return (
		<div className="max-w-full mx-auto py-10 px-4">
			<h1 className="text-3xl font-bold mb-6">All Transactions</h1>
			<Card className="mb-6 p-4">
				<div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
					<Input
						placeholder="Search by ref, item, email, status..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="max-w-xs"
					/>
					<span className="text-muted-foreground text-sm">
						Showing {filtered.length} of {transactions.length} transactions
					</span>
				</div>
			</Card>
			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<Card className="overflow-x-auto p-0">
				<Table>
					<TableCaption>All payment transactions</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Ref</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Item</TableHead>
							<TableHead>Net</TableHead>
							<TableHead>Fee</TableHead>
							<TableHead>Total</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>User Name</TableHead>
							<TableHead>User ID</TableHead>
							<TableHead>Preview</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={9} className="text-center">
									<Illustration type="loading" className="m-auto" />
								</TableCell>
							</TableRow>
						) : filtered.length === 0 ? (
							<TableRow>
								<TableCell colSpan={9} className="text-center">
									No transactions found.
								</TableCell>
							</TableRow>
						) : (
							filtered.map((t) => (
								<TableRow key={t.pf_payment_id}>
									<TableCell>
										{t.created_at
											? new Date(t.created_at).toLocaleString()
											: "-"}
									</TableCell>
									<TableCell>
										<span className="font-mono text-xs">
											{t.m_payment_id || t.pf_payment_id}
										</span>
									</TableCell>
									<TableCell>
										<Badge
											variant={
												t.payment_status === "COMPLETE"
													? "default"
													: "destructive"
											}>
											{t.payment_status}
										</Badge>
									</TableCell>
									<TableCell>
										<span title={t.item_description}>{t.item_name}</span>
									</TableCell>
									<TableCell>
										{t.amount_net !== undefined
											? `R ${Number(t.amount_net).toFixed(2)}`
											: ""}
									</TableCell>
									<TableCell>
										{t.amount_fee !== undefined
											? `R ${Math.abs(Number(t.amount_fee)).toFixed(2)}`
											: ""}
									</TableCell>
									<TableCell>
										{t.amount_gross !== undefined
											? `R ${Number(t.amount_gross).toFixed(2)}`
											: ""}
									</TableCell>
									<TableCell>{t.email_address || "-"}</TableCell>
									<TableCell>
										{t.name_first || t.name_last
											? `${t.name_first || ""} ${t.name_last || ""}`.trim()
											: "-"}
									</TableCell>
									<TableCell>{t.custom_str1 || "-"}</TableCell>
									<TableCell>
										<Dialog>
											<DialogTrigger asChild>
												<button
													type="button"
													className="flex items-center gap-1 px-2 py-1 rounded bg-muted text-foreground border border-gray-200 hover:bg-gray-100 transition"
													onClick={() => setSelectedTx(t)}
													title="Preview Receipt">
													<Eye className="w-4 h-4" />
													<span className="sr-only">Preview</span>
												</button>
											</DialogTrigger>
											<DialogContent>
												<DialogTitle>Transaction Receipt</DialogTitle>
												{selectedTx && (
													<Receipt
														transaction={selectedTx}
														receiptRef={receiptRef}
													/>
												)}
											</DialogContent>
										</Dialog>
									</TableCell>
									{/* Username, Merchant ID, and User ID cells are intentionally omitted */}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
}
