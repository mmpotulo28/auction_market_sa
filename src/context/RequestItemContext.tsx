"use client";
import React, {
	createContext,
	useEffect,
	useState,
	FormEvent,
	ChangeEvent,
	ReactNode,
} from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

export interface Auction {
	id: string;
	name: string;
	description: string;
	start_time: string;
}
export interface RequestFormState {
	itemName: string;
	itemDescription: string;
	itemImages: File[];
	condition: "new" | "used";
	requesterName: string;
	requesterEmail: string;
	requesterUserId: string;
}

const initial: RequestFormState = {
	itemName: "",
	itemDescription: "",
	itemImages: [],
	condition: "new",
	requesterName: "",
	requesterEmail: "",
	requesterUserId: "",
};

interface RequestItemFormContextType {
	auctions: Auction[];
	selectedAuction: Auction | null;
	setSelectedAuction: (a: Auction | null) => void;
	form: RequestFormState;
	setForm: React.Dispatch<React.SetStateAction<RequestFormState>>;
	step: number;
	setStep: React.Dispatch<React.SetStateAction<number>>;
	submitting: boolean;
	submitMsg: string | null;
	handleChange: (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => void;
	handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleSubmit: (e: FormEvent) => Promise<void>;
}

export const RequestItemFormContext = createContext<RequestItemFormContextType | undefined>(
	undefined,
);

export function RequestItemFormProvider({ children }: { children: ReactNode }) {
	const [auctions, setAuctions] = useState<Auction[]>([]);
	const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
	const [form, setForm] = useState<RequestFormState>(initial);
	const [step, setStep] = useState<number>(1);
	const [submitting, setSubmitting] = useState(false);
	const [submitMsg, setSubmitMsg] = useState<string | null>(null);
	const { user } = useUser();

	useEffect(() => {
		if (selectedAuction) {
			setStep(2);
		} else {
			setStep(1);
		}
	}, [selectedAuction]);

	useEffect(() => {
		axios
			.get("/api/auctions")
			.then((r) => setAuctions(r.data || []))
			.catch(() => setAuctions([]));
	}, []);

	useEffect(() => {
		if (user) {
			setForm((f) => ({
				...f,
				requesterName: `${user.firstName} ${user.lastName}`.trim(),
				requesterEmail: user.primaryEmailAddress?.emailAddress || "",
				requesterUserId: user.id,
			}));
		}
	}, [user]);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setForm((f) => ({ ...f, [name]: value }));
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		setForm((f) => ({
			...f,
			itemImages: e.target.files ? Array.from(e.target.files) : [],
		}));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setSubmitMsg(null);

		try {
			const data = new FormData();
			data.append("auctionName", selectedAuction?.name || "");
			Object.entries(form).forEach(([k, v]) => {
				if (k !== "itemImages") data.append(k, v as string);
			});
			form.itemImages.forEach((file) => data.append("itemImages", file));
			await axios.post("/api/auction-item-requests", data);
			setSubmitMsg("Request submitted! We'll review your suggestion soon.");
			setForm(initial);
			setStep(1);
			setSelectedAuction(null);
		} catch {
			setSubmitMsg("Failed to submit request. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	const value: RequestItemFormContextType = {
		auctions,
		selectedAuction,
		setSelectedAuction,
		form,
		setForm,
		step,
		setStep,
		submitting,
		submitMsg,
		handleChange,
		handleFileChange,
		handleSubmit,
	};

	return (
		<RequestItemFormContext.Provider value={value}>{children}</RequestItemFormContext.Provider>
	);
}
