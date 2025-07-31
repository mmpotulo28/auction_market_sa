"use client";
import React, { JSX } from "react";
import styles from "./actions.module.css";
import { iButtonProps, iVariant } from "@/lib/types";
import { Button } from "@/components/ui/button";

export interface iActionProps {
	actions?: iButtonProps[];
	fullWidth?: boolean;
	className?: string;
}

/**
 * The `Actions` component renders a list of action buttons.
 *
 * @param {iActionProps} props - The properties for the Actions component.
 * @param {Array} props.actions - An array of action objects to be rendered as buttons.
 * @param {boolean} [props.fullWidth=false] - A flag to determine if the buttons should take the full width of the container.
 *
 * @returns {JSX.Element} A div containing a list of buttons.
 */
const Actions: React.FC<iActionProps> = ({
	actions,
	fullWidth = false,
	className = "",
}: iActionProps): JSX.Element => {
	function getVariant(variant?: iVariant) {
		let ButtonVariant:
			| "default"
			| "secondary"
			| "ghost"
			| "link"
			| "destructive"
			| "outline"
			| null = "default";

		switch (variant) {
			case iVariant.Primary:
				ButtonVariant = "default";
				break;
			case iVariant.Secondary:
				ButtonVariant = "outline";
				break;
			case iVariant.Tertiary:
				ButtonVariant = "ghost";
				break;
			case iVariant.Quaternary:
				ButtonVariant = "destructive";
				break;
			case iVariant.Quinary:
				ButtonVariant = "default";
				break;
			default:
				ButtonVariant = "default";
				break;
		}

		return ButtonVariant;
	}

	return (
		<div className={`${className} ${styles.actions} ${fullWidth ? styles.fullWidth : ""}`}>
			{actions?.map((action) =>
				action.hide ? null : (
					<Button
						className={styles.button + (action.className ? ` ${action.className}` : "")}
						variant={getVariant(action.variant)}
						key={`${action.key}-${action.label}`}
						onClick={action.click ? action.click : undefined}>
						{action.iconStart && action.iconStart}
						{action.label}
						{action.iconEnd && action.iconEnd}
					</Button>
				),
			)}
		</div>
	);
};

export default Actions;
