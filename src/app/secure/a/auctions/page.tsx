"use client";

import React, { useState, useEffect } from "react";
import {
	ColumnDef,
	SortingState,
	ColumnFiltersState,
	VisibilityState,
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import styles from "./auctions.module.css";
import { DeleteIcon, Edit, PlusCircle } from "lucide-react";
import { toast } from "sonner";

interface Auction {
	id: number;
	name: string;
	items_count: number;
	start_time: string;
	duration: number;
	re_open_count: number;
	description?: string;
	date_created: string;
	created_by: string;
}

const AuctionsPage: React.FC = () => {
	const [auctions, setAuctions] = useState<Auction[]>([]);
	const [, setLoading] = useState(true);
	const [, setError] = useState<string | null>(null);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [formData, setFormData] = useState<Partial<Auction>>({
		name: "",
		items_count: 0,
		start_time: "",
		duration: 0,
		re_open_count: 0,
		description: "",
		created_by: "",
	});

	useEffect(() => {
		const fetchAuctions = async () => {
			try {
				const response = await axios.get("/api/auctions");
				setAuctions(response.data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to fetch auctions");
				toast.error("Failed to fetch auctions. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchAuctions();
	}, []);

	const handleDelete = async (id: number) => {
		try {
			await axios.delete(`/api/auctions?id=${id}`);
			setAuctions((prev) => prev.filter((auction) => auction.id !== id));
			toast.success("Auction deleted successfully!");
		} catch {
			toast.error("Failed to delete auction. Please try again.");
		}
	};

	const handleEdit = (auction: Auction) => {
		setFormData(auction);
		setIsEditMode(true);
		setIsDialogOpen(true);
	};

	const handleAddNew = () => {
		setFormData({
			name: "",
			items_count: 0,
			start_time: "",
			duration: 0,
			re_open_count: 0,
			description: "",
			created_by: "",
		});
		setIsEditMode(false);
		setIsDialogOpen(true);
	};

	const handleSubmit = async () => {
		try {
			if (isEditMode) {
				await axios.post("/api/auctions", formData);
				setAuctions((prev) =>
					prev.map((auction) =>
						auction.id === formData.id ? { ...auction, ...formData } : auction,
					),
				);
				toast.success("Auction updated successfully!");
			} else {
				const response = await axios.post("/api/auctions", formData);
				setAuctions((prev) => [...prev, response.data[0]]);
				toast.success("Auction created successfully!");
			}
			setIsDialogOpen(false);
		} catch {
			toast.error("Failed to save auction. Please try again.");
		}
	};

	const columns: ColumnDef<Auction>[] = [
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			accessorKey: "items_count",
			header: "Items Count",
		},
		{
			accessorKey: "start_time",
			header: "Start Time",
			cell: ({ row }) => new Date(row.getValue("start_time")).toLocaleString(),
		},
		{
			accessorKey: "duration",
			header: "Duration (mins)",
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => (
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => handleEdit(row.original)}>
						<Edit className="mr-2" />
						Edit
					</Button>
					<Button variant="destructive" onClick={() => handleDelete(row.original.id)}>
						<DeleteIcon className="mr-2" />
						Delete
					</Button>
				</div>
			),
		},
	];

	const table = useReactTable({
		data: auctions,
		columns,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<div className={styles.container}>
			<h1 className="text-2xl font-bold mb-4">Auctions</h1>
			<div className="flex items-center py-4">
				<Input
					placeholder="Filter by name..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
					className="max-w-sm"
				/>
				<Button variant="secondary" className="ml-auto" onClick={handleAddNew}>
					Add New Auction <PlusCircle className="ml-2" />
				</Button>
			</div>
			<div className="rounded-md border w-full">
				<Table className="w-full">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="text-center">
									No auctions found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}>
					Next
				</Button>
			</div>

			{/* Dialog for Add/Edit Auction */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{isEditMode ? "Edit Auction" : "Add New Auction"}</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<Input
							placeholder="Name"
							value={formData.name || ""}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						/>
						<Input
							placeholder="Items Count"
							type="number"
							value={formData.items_count || 0}
							onChange={(e) =>
								setFormData({ ...formData, items_count: parseInt(e.target.value) })
							}
						/>
						<Input
							placeholder="Start Time"
							type="datetime-local"
							value={formData.start_time || ""}
							onChange={(e) =>
								setFormData({ ...formData, start_time: e.target.value })
							}
						/>
						<Input
							placeholder="Duration (mins)"
							type="number"
							value={formData.duration || 0}
							onChange={(e) =>
								setFormData({ ...formData, duration: parseInt(e.target.value) })
							}
						/>
						<Input
							placeholder="Re-open Count"
							type="number"
							value={formData.re_open_count || 0}
							onChange={(e) =>
								setFormData({
									...formData,
									re_open_count: parseInt(e.target.value),
								})
							}
						/>
						<Input
							placeholder="Description"
							value={formData.description || ""}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
						/>
					</div>
					<div className="flex justify-end mt-4">
						<Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
							Cancel
						</Button>
						<Button variant="default" className="ml-2" onClick={handleSubmit}>
							{isEditMode ? "Save Changes" : "Create Auction"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AuctionsPage;
