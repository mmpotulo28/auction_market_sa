import { RequestItemFormContext } from "@/context/RequestItemContext";
import { useContext } from "react";

export function useRequestItemForm() {
	const ctx = useContext(RequestItemFormContext);
	if (!ctx)
		throw new Error("useRequestItemFormContext must be used within a RequestItemFormProvider");
	return ctx;
}
