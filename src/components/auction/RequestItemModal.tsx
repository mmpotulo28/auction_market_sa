import React, { useState } from "react";
import styles from "./RequestItemModal.module.css";
import { FaRegImage, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

interface RequestItemModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	auctionName: string;
}

const initialForm = {
	itemName: "",
	itemDescription: "",
	itemImages: [] as File[],
	condition: "new",
	requesterName: "",
	requesterEmail: "",
	requesterUserId: "",
};

const RequestItemModal: React.FC<RequestItemModalProps> = ({ open, onOpenChange, auctionName }) => {
	const [requestForm, setRequestForm] = useState(initialForm);
	const [submitting, setSubmitting] = useState(false);
	const [submitMsg, setSubmitMsg] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const { user } = useUser();

	const handleRequestChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setRequestForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files ? Array.from(e.target.files) : [];
		setRequestForm((prev) => ({ ...prev, itemImages: files }));
	};

	const handleRequestSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setSubmitMsg(null);
		try {
			const formData = new FormData();
			formData.append("auctionName", auctionName);
			formData.append("itemName", requestForm.itemName);
			formData.append("itemDescription", requestForm.itemDescription);
			formData.append("condition", requestForm.condition);
			formData.append("requesterName", requestForm.requesterName);
			formData.append("requesterEmail", requestForm.requesterEmail);
			formData.append("requesterUserId", requestForm.requesterUserId);
			requestForm.itemImages.forEach((file) => {
				formData.append("itemImages", file, file.name);
			});
			await axios.post("/api/auction-item-requests", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			setSubmitMsg("Request submitted! We'll review your suggestion soon.");
			setRequestForm(initialForm);
		} catch (err: any) {
			setSubmitMsg("Failed to submit request. Please try again.");
			console.error("Error submitting request:", err);
		}
		setSubmitting(false);
	};

	const handleInitialYes = () => setShowForm(true);
	const handleInitialNo = () => {
		setShowForm(false);
		onOpenChange(false);
	};

	// Prefill user info if available
	React.useEffect(() => {
		if (user) {
			setRequestForm((prev) => ({
				...prev,
				requesterName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
				requesterEmail: user.primaryEmailAddress?.emailAddress ?? "",
				requesterUserId: user.id ?? "",
			}));
		}
	}, [user]);

	if (!open) return null;

	return (
		<div className={styles.overlay}>
			<div className={`${styles.modal} ${showForm ? styles.slideIn : ""}`} tabIndex={-1}>
				<button className={styles.closeBtn} onClick={() => onOpenChange(false)}>
					&times;
				</button>
				<div className={styles.iconWrap}>
					<FaRegImage className={styles.icon} />
				</div>
				{!showForm ? (
					<div className={styles.initialPrompt}>
						<h2 className={styles.title}>Request an Item?</h2>
						<p className={styles.subtitle}>
							Would you like to request an item to be added to this auction?
						</p>
						<div className={styles.promptActions}>
							<button className={styles.submitBtn} onClick={handleInitialYes}>
								Yes, request item
							</button>
							<button
								className={`${styles.submitBtn} ${styles.noBtn}`}
								onClick={handleInitialNo}
								type="button"
							>
								No, thanks
							</button>
						</div>
					</div>
				) : (
					<form onSubmit={handleRequestSubmit} className={`${styles.form} ${styles.formSlideIn}`} autoComplete="off">
						<div className={styles.fieldGroup}>
							<label className={styles.label}>Your Name</label>
							<input
								name="requesterName"
								value={requestForm.requesterName}
								onChange={handleRequestChange}
								required
								className={styles.input}
								disabled={!!user}
							/>
						</div>
						<div className={styles.fieldGroup}>
							<label className={styles.label}>Your Email</label>
							<input
								name="requesterEmail"
								type="email"
								value={requestForm.requesterEmail}
								onChange={handleRequestChange}
								required
								className={styles.input}
								disabled={!!user}
							/>
						</div>
						<div className={styles.fieldGroup}>
							<label className={styles.label}>Your User ID (optional)</label>
							<input
								name="requesterUserId"
								value={requestForm.requesterUserId}
								onChange={handleRequestChange}
								className={styles.input}
								disabled={!!user}
							/>
						</div>
						<div className={styles.fieldGroup}>
							<label className={styles.label}>Item Name</label>
							<input
								name="itemName"
								value={requestForm.itemName}
								onChange={handleRequestChange}
								required
								className={styles.input}
							/>
						</div>
						<div className={styles.fieldGroup}>
							<label className={styles.label}>Condition</label>
							<select
								name="condition"
								value={requestForm.condition}
								onChange={handleRequestChange}
								className={`${styles.input} ${styles.select}`}>
								<option value="new">New</option>
								<option value="used">Used</option>
							</select>
						</div>
						<div className={styles.fieldGroup}>
							<label className={styles.label}>Item Images (optional)</label>
							<input
								name="itemImages"
								type="file"
								multiple
								accept="image/*"
								onChange={handleFileChange}
								className={styles.input}
							/>
							{requestForm.itemImages.length > 0 && (
								<div className={styles.fileList}>
									{requestForm.itemImages.map((file, idx) => (
										<span key={idx} className={styles.fileBadge}>
											{file.name}
										</span>
									))}
								</div>
							)}
						</div>
						<div className={`${styles.fieldGroup} ${styles.description}`}>
							<label className={styles.label}>Item Description</label>
							<textarea
								name="itemDescription"
								value={requestForm.itemDescription}
								onChange={handleRequestChange}
								required
								className={styles.textarea}
							/>
						</div>
						<button type="submit" disabled={submitting} className={styles.submitBtn}>
							{submitting ? "Submitting..." : "Submit Request"}
						</button>
						{submitMsg && (
							<div
								className={`${styles.submitMsg} ${
									submitMsg.startsWith("Request submitted")
										? styles.successMsg
										: styles.errorMsg
								}`}>
								{submitMsg.startsWith("Request submitted") ? (
									<FaCheckCircle />
								) : (
									<FaExclamationCircle />
								)}
								<span>{submitMsg}</span>
							</div>
						)}
					</form>
				)}
			</div>
		</div>
	);
};

export default RequestItemModal;
