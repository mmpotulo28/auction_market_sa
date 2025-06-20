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
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, RotateCcw } from "lucide-react";
import { iTransaction } from "@/lib/types";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Receipt from "@/components/Reciept";
import Container from "@/components/common/container";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Illustration from "@/components/Illustration";

export default function UserTransactionsPage() {
	const [transactions, setTransactions] = useState<iTransaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedTransaction, setSelectedTransaction] = useState<iTransaction | null>(null);
	const receiptRef = useRef<HTMLDivElement | null>(null);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);
	const [total, setTotal] = useState(0);

	const fetchTransactions = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await axios.get<{
				transactions: iTransaction[];
				total: number;
				error?: string;
			}>(`/api/transactions/user?page=${page}&pageSize=${pageSize}`);
			const data = res.data;
			if (data.transactions) {
				setTransactions(data.transactions);
				setTotal(data.total || 0);
			} else setError(data.error || "No transactions found.");
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
		fetchTransactions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, pageSize]);

	const totalPages = Math.ceil(total / pageSize);

	return (
		<Container>
			<div className="max-w-full mx-auto py-10 px-4">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-3xl font-bold mb-6">My Transactions</h1>
					<Button
						variant="ghost"
						size="icon"
						onClick={fetchTransactions}
						title="Refetch transactions">
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
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Ref</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Item</TableHead>
								<TableHead>Net</TableHead>
								<TableHead>Fee</TableHead>
								<TableHead>Total</TableHead>
								<TableHead>Receipt</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={8} className="text-center">
										<Illustration type="loading" className="m-auto" />
									</TableCell>
								</TableRow>
							) : transactions.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8} className="text-center">
										No transactions found.
									</TableCell>
								</TableRow>
							) : (
								transactions.map((t) => (
									<TableRow key={t.pf_payment_id}>
										<TableCell>
											{t.created_at
												? new Date(t.created_at).toLocaleString()
												: "-"}
										</TableCell>
										<TableCell>{t.m_payment_id || t.pf_payment_id}</TableCell>
										<TableCell>
											<Badge>{t.payment_status}</Badge>
										</TableCell>
										<TableCell>{t.item_name}</TableCell>
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
										<TableCell>
											<Dialog>
												<DialogTrigger asChild>
													<button
														type="button"
														className="flex items-center gap-1 px-2 py-1 rounded bg-muted text-foreground border border-gray-200 hover:bg-gray-100 transition"
														onClick={() => setSelectedTransaction(t)}
														title="Preview Receipt">
														<Eye className="w-4 h-4" />
														<span className="sr-only">Preview</span>
													</button>
												</DialogTrigger>
												{selectedTransaction &&
													selectedTransaction.pf_payment_id ===
														t.pf_payment_id && (
														<DialogContent>
															<DialogTitle>
																Transaction Receipt
															</DialogTitle>
															<Receipt
																transaction={selectedTransaction}
																receiptRef={receiptRef}
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
					<Pagination className="mt-4">
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() => setPage((p) => Math.max(1, p - 1))}
									aria-disabled={page === 1}
									className={page === 1 ? "pointer-events-none opacity-50" : ""}
								/>
							</PaginationItem>
							{[...Array(totalPages)].map((_, idx) => {
								const pageNum = idx + 1;
								if (
									pageNum === 1 ||
									pageNum === totalPages ||
									(pageNum >= page - 1 && pageNum <= page + 1)
								) {
									return (
										<PaginationItem key={pageNum}>
											<PaginationLink
												onClick={() => setPage(pageNum)}
												isActive={page === pageNum}>
												{pageNum}
											</PaginationLink>
										</PaginationItem>
									);
								} else if (
									(pageNum === page - 2 && page > 3) ||
									(pageNum === page + 2 && page < totalPages - 2)
								) {
									return (
										<PaginationItem key={pageNum + "-ellipsis"}>
											<PaginationEllipsis />
										</PaginationItem>
									);
								}
								return null;
							})}
							<PaginationItem>
								<PaginationNext
									onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
									aria-disabled={page === totalPages}
									className={
										page === totalPages ? "pointer-events-none opacity-50" : ""
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</Card>
			</div>
		</Container>
	);
}
