import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { useRequestItemForm } from "@/hooks/useRequestItemForm";
import { useUser } from "@clerk/nextjs";
import styles from "./request-item-form.module.css";
import CopyElement from "../CopyElement";

export const FormStep1: React.FC = () => {
	const { auctions, setSelectedAuction, setStep } = useRequestItemForm();

	return (
		<>
			<h2 className={styles.cardTitle}>Select an Auction</h2>
			{auctions.length === 0 ? (
				<div className={styles.empty}>No auctions available.</div>
			) : (
				<ul className={styles.auctionList}>
					{auctions.map((auction, idx) => (
						<li
							key={auction.id}
							className={`${styles.auctionItem} ${styles.auctionSlideIn}`}
							style={{ animationDelay: `${idx * 60}ms` }}
							onClick={() => {
								setStep(2);
								setSelectedAuction(auction);
							}}>
							<div>
								<span className={styles.auctionName}>{auction.name}</span>
								<span className={styles.auctionDesc}>{auction.description}</span>
							</div>
							<span className={styles.auctionDate}>
								{new Date(auction.start_time).toLocaleDateString()}
							</span>
						</li>
					))}
				</ul>
			)}
		</>
	);
};

export const FormStep2: React.FC = () => {
	const {
		selectedAuction,
		setSelectedAuction,
		form,
		setStep,
		submitting,
		submitMsg,
		handleChange,
		handleFileChange,
		handleSubmit,
		setForm,
	} = useRequestItemForm();
	const { user } = useUser();

	return (
		<form
			className={`${styles.form} ${styles.formGrid} ${styles.formSlideIn}`}
			onSubmit={handleSubmit}
			autoComplete="off">
			<div className={styles.formHeader}>
				<button
					type="button"
					className={styles.backBtn}
					onClick={() => {
						setStep(1);
						setSelectedAuction(null);
					}}>
					&larr; Back
				</button>
				<h2 className={styles.cardTitle}>
					Request for <span className={styles.auctionName}>{selectedAuction?.name}</span>
				</h2>
			</div>
			<div className={styles.fieldGroup}>
				<label className={styles.label}>Item Name</label>
				<Input name="itemName" value={form.itemName} onChange={handleChange} required />
			</div>
			<div className={styles.fieldGroup}>
				<label className={styles.label}>Condition</label>
				<Select
					value={form.condition}
					onValueChange={(value) =>
						setForm((prev) => ({ ...prev, condition: value as "new" | "used" }))
					}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select a condition" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Select condition</SelectLabel>
							<SelectItem value="new">New</SelectItem>
							<SelectItem value="used">Used</SelectItem>
							<SelectItem value="refurbished">Refurbished</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div className={styles.fieldGroup}>
				<label className={styles.label}>Item Images (optional)</label>
				<Input
					name="itemImages"
					type="file"
					multiple
					accept="image/*"
					onChange={handleFileChange}
				/>
				{form.itemImages.length > 0 && (
					<div className={styles.fileList}>
						{form.itemImages.map((file, idx) => (
							<span key={idx} className={styles.fileBadge}>
								<CopyElement content={file.name} />
							</span>
						))}
					</div>
				)}
			</div>
			<div className={styles.fieldGroup}>
				<label hidden={!!user} className={styles.label}>
					Your Name
				</label>
				<Input
					name="requesterName"
					value={form.requesterName}
					onChange={handleChange}
					required
					disabled={!!user}
					hidden={!!user}
				/>
			</div>
			<div className={styles.fieldGroup}>
				<label hidden={!!user} className={styles.label}>
					Your Email
				</label>
				<Input
					name="requesterEmail"
					type="email"
					value={form.requesterEmail}
					onChange={handleChange}
					required
					disabled={!!user}
					hidden={!!user}
				/>
			</div>
			<div className={styles.fieldGroup}>
				<label hidden={!!user} className={styles.label}>
					Your User ID (optional)
				</label>
				<Input
					aria-label="Your User ID"
					name="requesterUserId"
					value={form.requesterUserId}
					onChange={handleChange}
					disabled={!!user}
					hidden={!!user}
				/>
			</div>

			<div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
				<label className={styles.label}>Item Description</label>
				<Textarea
					name="itemDescription"
					value={form.itemDescription}
					onChange={handleChange}
					required
				/>
			</div>
			{<span className={styles.infoText}>Fields marked with * are required</span>}
			<Button type="submit" disabled={submitting}>
				{submitting ? "Submitting..." : "Submit Request"}
			</Button>
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
	);
};
