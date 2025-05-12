"use client";
import React, { useState, useEffect } from "react";
import styles from "./add-items.module.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";
import Container from "@/components/common/container";
import { AddItemData, addItemToDatabase } from "@/lib/dbFunctions";

interface AddNewItemFormProps {
	item: AddItemData;
	onSubmit: (response: { success: boolean; error: string | undefined }) => void;
	buttonText: string;
}

const AddNewItemForm: React.FC<AddNewItemFormProps> = ({ item, onSubmit, buttonText }) => {
	const [formData, setFormData] = useState<AddItemData>(item);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (item) {
			setFormData(item);
		}
	}, [item]);

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
		} else {
			toast.error(result.error || "Unexpected error occurred.");
		}

		setIsSubmitting(false);
		onSubmit({
			success: result.success,
			error: result.error,
		});
	};

	return (
		<Container padded={false}>
			<div className={styles.container}>
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
						required={!item?.imageFile}
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
								type="radio"
								name="condition"
								value="new"
								checked={formData.condition === "new"}
								onChange={handleChange}
							/>
							New
						</label>
						<label>
							<Input
								type="radio"
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
							buttonText
						)}
					</Button>
				</form>
			</div>
		</Container>
	);
};

export default AddNewItemForm;
