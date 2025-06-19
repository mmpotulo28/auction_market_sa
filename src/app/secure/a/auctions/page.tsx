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
import { iAuction } from "@/lib/types";
import { FaSpinner } from "react-icons/fa";
import Illustration from "@/components/Illustration";

const AuctionsPage: React.FC = () => {
	const [auctions, setAuctions] = useState<iAuction[]>([]);
	const [, setError] = useState<string | null>(null);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<iAuction>({
		id: "",
		name: "",
		items_count: 0,
		start_time: "",
		duration: 0,
		re_open_count: 0,
		description: "",
		created_by: "",
		date_created: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const fetchAuctions = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get("/api/auctions");
				console.log(response);
				setAuctions(response.data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to fetch auctions");
				toast.error("Failed to fetch auctions. Please try again.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchAuctions();
	}, []);

	const handleDelete = async (id: number | string) => {
		try {
			await axios.delete(`/api/auctions?id=${id}`);
			setAuctions((prev) => prev.filter((auction) => String(auction.id) !== String(id)));
			toast.success("Auction deleted successfully!");
		} catch (error) {
			console.error("Failed to delete auction: ", error);
			toast.error("Failed to delete auction. Please try again.");
		}
	};

	const handleEdit = (auction: iAuction) => {
		setFormData(auction);
		setIsEditMode(true);
		setIsDialogOpen(true);
	};

	const handleAddNew = () => {
		setFormData({
			id: "",
			name: "",
			items_count: 0,
			start_time: "",
			duration: 0,
			re_open_count: 0,
			description: "",
			created_by: "",
			date_created: "",
		});
		setIsEditMode(false);
		setIsDialogOpen(true);
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			const payload = formData;
			if (isEditMode) {
				await axios.put("/api/auctions", payload);
				setAuctions((prev) =>
					prev.map((auction) =>
						auction.id === formData.id ? { ...auction, ...formData } : auction,
					),
				);
				toast.success("Auction updated successfully!");
			} else {
				const response = await axios.post("/api/auctions", payload);
				setAuctions((prev) => [...prev, response.data[0]]);
				toast.success("Auction created successfully!");
			}
			setIsDialogOpen(false);
		} catch (error) {
			console.error("Failed to save auction: ", error);
			toast.error("Failed to save auction. Please try again.");
		}
		setIsSubmitting(false);
	};

	const columns: ColumnDef<iAuction>[] = [
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			accessorKey: "items_count",
			header: "Items Count",
		},
		{
			accessorKey: "re_open_count",
			header: "Re-open Count",
		},
		{
			accessorKey: "start_time",
			header: "Start Time",
			cell: ({ row }) =>
				row.getValue("start_time")
					? new Date(row.getValue("start_time")).toLocaleString()
					: "",
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
									{isLoading ? (
										<>
											<Illustration type="loading" className="m-auto" />
										</>
									) : (
										"No Auctions Found!"
									)}
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
						<div>
							<label className="block mb-1 font-medium">Name</label>
							<Input
								placeholder="Name"
								value={formData.name || ""}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Items Count</label>
							<Input
								placeholder="Items Count"
								type="number"
								value={formData.items_count || 0}
								onChange={(e) =>
									setFormData({
										...formData,
										items_count: parseInt(e.target.value),
									})
								}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Start Time</label>
							<Input
								placeholder="Start Time"
								type="datetime-local"
								value={
									formData.start_time
										? new Date(formData.start_time).toISOString().slice(0, 16)
										: ""
								}
								onChange={(e) =>
									setFormData({
										...formData,
										start_time: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Duration (mins)</label>
							<Input
								placeholder="Duration (mins)"
								type="number"
								value={formData.duration || 0}
								onChange={(e) =>
									setFormData({ ...formData, duration: parseInt(e.target.value) })
								}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Re-open Count</label>
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
						</div>
						<div>
							<label className="block mb-1 font-medium">Description</label>
							<Input
								placeholder="Description"
								value={formData.description || ""}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Created By</label>
							<Input
								placeholder="Created By"
								value={formData.created_by || ""}
								onChange={(e) =>
									setFormData({ ...formData, created_by: e.target.value })
								}
							/>
						</div>
					</div>
					<div className="flex justify-end mt-4">
						<Button
							variant="secondary"
							onClick={() => setIsDialogOpen(false)}
							disabled={isSubmitting}>
							Cancel
						</Button>
						<Button
							variant="default"
							className="ml-2 flex items-center"
							onClick={handleSubmit}
							disabled={isSubmitting}>
							{isSubmitting && <FaSpinner className="spin" />}
							{isEditMode ? "Save Changes" : "Create Auction"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AuctionsPage;
