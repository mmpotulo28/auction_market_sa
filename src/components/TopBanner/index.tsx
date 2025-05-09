"use client";
import LockUp from "@/components/common/lockup";
import { CarouselDApiSlider } from "./slider";
import styles from "./top-banner.module.css";
import Actions from "../common/Actions";
import { iButtonProps, iLockUpProps, iSize } from "@/lib/types";
import Image from "next/image";
import { Suspense } from "react";
import { useWebSocket } from "@/context/WebSocketProvider";

export interface iTopBannerProps extends iLockUpProps {
	action?: iButtonProps;
}

const TopBanner: React.FC<iTopBannerProps> = ({ action, title, overline, subtitle }) => {
	const { items } = useWebSocket();

	return (
		<div className={styles.topBanner}>
			<div className={styles.bannerLeftContent}>
				<Suspense fallback={<div>Loading Items...</div>}>
					<CarouselDApiSlider items={items} />
				</Suspense>
			</div>

			<Image
				className={styles.centerImage}
				src="/images/amsa-logo.png"
				alt="Logo"
				width={100}
				height={100}
			/>

			{/* banner right content with welcome text  */}
			<div className={styles.bannerRightContent}>
				<LockUp
					overline={overline}
					title={title}
					subtitle={subtitle}
					size={iSize.Large}
					centered
				/>

				<Actions
					actions={[
						{
							label: action?.label || "Get Started",
							click: () => console.log("Get Started clicked"),
						},
					]}
				/>
			</div>
		</div>
	);
};

export default TopBanner;
