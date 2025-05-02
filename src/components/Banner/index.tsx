"use client";
import React from "react";
import styles from "./banner.module.css";
import { ImageProps } from "next/image";
import { iButtonProps, iSize, iTheme } from "@/lib/types";

import Actions from "../common/Actions";
import LockUp from "../common/lockup";
import Container from "../common/container";

export interface iBannerProps {
	title: string;
	content: string;
	actions?: iButtonProps[];
	image?: ImageProps;
	size?: iSize;
}

const Banner: React.FC<iBannerProps> = ({
	title,
	content,
	actions,
	size = iSize.Small,
	image = { src: "banner-image1.jpg", alt: "banner image" },
}) => {
	const classSize = () => {
		switch (size) {
			case iSize.Small:
				return styles.small;
			case iSize.Medium:
				return styles.medium;
			case iSize.Large:
				return styles.large;
			default:
				return styles.small;
		}
	};

	return (
		<div
			className={`${styles.bannerContainer} ${classSize()}`}
			style={{ backgroundImage: `url("/images/${image.src}")` }}>
			<Container>
				<div className={styles.banner}>
					<div className={styles.content}>
						<LockUp
							title={title}
							subtitle={content}
							size={iSize.Large}
							theme={iTheme.Light}
						/>
					</div>
					<Actions actions={actions} />
				</div>
			</Container>
		</div>
	);
};

export default Banner;
