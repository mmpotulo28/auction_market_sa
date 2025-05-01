"use client";
import LockUp from "@/components/common/lockup";
import { CarouselDApiSlider } from "./slider";
import styles from "./top-banner.module.css";
import Actions from "../common/Actions";
import { iSize } from "@/lib/types";
import Image from "next/image";

const TopBanner = () => {
	return (
		<div className={styles.topBanner}>
			<div className={styles.bannerLeftContent}>
				<CarouselDApiSlider />
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
					overline="Welcome"
					title="Auction Market SA"
					subtitle="South Africa's Marketplace Auction"
					size={iSize.Large}
					centered
				/>

				<Actions
					actions={[
						{
							label: "Get Started",
							click: () => console.log("Get Started clicked"),
						},
					]}
				/>
			</div>
		</div>
	);
};

export default TopBanner;
