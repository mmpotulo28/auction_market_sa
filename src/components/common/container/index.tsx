"use client";
import { iTheme } from "@/lib/types";
import styles from "./container.module.css";
import { ReactNode, FC } from "react";

export interface iContainerProps {
	children?: ReactNode;
	padded?: boolean;
	fullWidth?: boolean;
	theme?: iTheme;
	className?: string;
}

const Container: FC<iContainerProps> = ({
	children,
	padded = true,
	fullWidth = false,
	theme = iTheme.Light,
	className = "",
}) => {
	const classNames = [
		styles.container,
		padded && styles.padded,
		fullWidth && styles.fullWidth,
		theme === iTheme.Dark && styles.dark,
		className,
	]
		.filter(Boolean)
		.join(" ");

	return <section className={classNames}>{children}</section>;
};

export default Container;
