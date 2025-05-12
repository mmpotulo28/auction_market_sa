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
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import supabase from "@/lib/db";
import { toast } from "sonner";
import styles from "./items.module.css";
import { iAuctionItem } from "@/lib/types";

const ItemsPage: React.FC = () => {
	const [items, setItems] = useState<iAuctionItem[]>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});

	// Fetch items
	useEffect(() => {
		const fetchItems = async () => {
			const { data, error } = await supabase.from("items").select("*");
			if (error) {
				toast.error("Failed to fetch items.");
				return;
			}
			setItems(data || []);
		};
		fetchItems();
	}, []);

	// Define columns for DataTable
	const columns: ColumnDef<iAuctionItem>[] = [
		{
			accessorKey: "title",
			header: "Title",
		},
		{
			accessorKey: "description",
			header: "Description",
		},
		{
			accessorKey: "price",
			header: "Price",
			cell: ({ row }) => `R${parseFloat(row.getValue("price")).toFixed(2)}`,
		},
		{
			accessorKey: "category",
			header: "Category",
		},
		{
			accessorKey: "condition",
			header: "Condition",
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => (
				<Button variant="destructive" onClick={() => handleDelete(row.original.id)}>
					Delete
				</Button>
			),
		},
	];

	// Handle delete item
	const handleDelete = async (id: string) => {
		const { error } = await supabase.from("items").delete().eq("id", id);
		if (error) {
			toast.error("Failed to delete item.");
			return;
		}
		toast.success("Item deleted successfully!");
		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	// Initialize table
	const table = useReactTable({
		data: items,
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
			<h1 className="text-2xl font-bold mb-4">Items Dashboard</h1>
			<div className="flex items-center py-4">
				<Input
					placeholder="Filter by title..."
					value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
					onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
					className="max-w-sm"
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columns <ChevronDown />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => (
								<DropdownMenuCheckboxItem
									key={column.id}
									checked={column.getIsVisible()}
									onCheckedChange={(value) => column.toggleVisibility(!!value)}>
									{column.id}
								</DropdownMenuCheckboxItem>
							))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="rounded-md border">
				<Table>
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
									No items found.
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
		</div>
	);
};

export default ItemsPage;
