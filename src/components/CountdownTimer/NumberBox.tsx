import React from "react";

interface numProp {
	num: string | number;
	unit: string;
}

export const NumberBox = ({ num, unit }: numProp) => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				marginTop: "1rem",
				paddingLeft: 0,
				paddingRight: 0,
			}}>
			<div
				style={{
					position: "relative",
					background: "transparent",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					borderRadius: "0.5rem",
					width: "3rem",
					height: "3rem",
					marginTop: "1rem",
				}}>
				<div
					style={{
						borderTopLeftRadius: "0.5rem",
						borderTopRightRadius: "0.5rem",
						background: "#343650",
						width: "100%",
						height: "100%",
					}}></div>
				<div
					style={{
						color: "var(--color-foreground)",
						fontSize: "1.75rem",
						position: "absolute",
						zIndex: 10,
						fontWeight: "bold",
						fontFamily: "monospace",
					}}>
					{num}
				</div>
				<div
					style={{
						borderBottomLeftRadius: "0.5rem",
						borderBottomRightRadius: "0.5rem",
						background: "#2c2e3f",
						width: "100%",
						height: "100%",
					}}></div>
			</div>
			<p
				style={{
					color: "var(--color-foreground)",
					fontSize: "1.125rem",
					marginTop: "0.75rem",
					fontWeight: 600,
				}}>
				{unit}
			</p>
		</div>
	);
};
