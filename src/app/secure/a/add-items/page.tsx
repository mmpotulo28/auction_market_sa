"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./add-items.module.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { addItemToDatabase } from "@/lib/dbFunctions";
import { FaSpinner } from "react-icons/fa";
import Container from "@/components/common/container";

const AddItemsPage: React.FC = () => {
	const router = useRouter();
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		price: "",
		imageFile: null as File | null,
		category: "",
		condition: "new",
		auctionId: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setFormData((prev) => ({ ...prev, imageFile: file }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		const result = await addItemToDatabase(formData);

		if (result.success) {
			toast.success("Item added successfully!");
			router.push("/secure/a/dashboard");
		} else {
			toast.error(result.error || "Unexpected error occurred.");
		}

		setIsSubmitting(false);
	};

	return (
		<Container>
			<div className={styles.container}>
				<h1 className="text-2xl font-bold mb-4">Add New Item</h1>
				<form onSubmit={handleSubmit} className={styles.form}>
					<Input
						name="title"
						placeholder="Item Title"
						value={formData.title}
						onChange={handleChange}
						required
					/>
					<Textarea
						name="description"
						placeholder="Item Description"
						value={formData.description}
						onChange={handleChange}
						required
					/>
					<Input
						name="price"
						type="number"
						placeholder="Price"
						value={formData.price}
						onChange={handleChange}
						required
					/>
					<Input
						name="imageFile"
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						required
					/>
					<Input
						name="category"
						placeholder="Category"
						value={formData.category}
						onChange={handleChange}
						required
					/>
					<Input
						name="auctionId"
						type="number"
						placeholder="Auction ID"
						value={formData.auctionId}
						onChange={handleChange}
						required
					/>
					<div className={styles.radioGroup}>
						<label>
							<Input
								type="checkbox"
								name="condition"
								value="new"
								checked={formData.condition === "new"}
								onChange={handleChange}
							/>
							New
						</label>
						<label>
							<Input
								type="checkbox"
								name="condition"
								value="used"
								checked={formData.condition === "used"}
								onChange={handleChange}
							/>
							Used
						</label>
					</div>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<FaSpinner className="spin" /> Submitting...
							</>
						) : (
							"Add Item"
						)}
					</Button>
				</form>
			</div>
		</Container>
	);
};

export default AddItemsPage;
