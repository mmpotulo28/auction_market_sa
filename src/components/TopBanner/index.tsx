"use client";
import LockUp from "@/components/common/lockup";
import { CarouselDApiSlider } from "./slider";
import styles from "./top-banner.module.css";
import Actions from "../common/Actions";
import { iSize } from "@/lib/types";

const TopBanner = () => {
	return (
		<div className={styles.topBanner}>
			<div className={styles.bannerLeftContent}>
				<CarouselDApiSlider />
			</div>

			{/* banner right content with welcome text  */}
			<div className={styles.bannerRightContent}>
				<LockUp
					overline="Welcome"
					title="Auction Market SA"
					subtitle="South Africa's Marketplace Auction"
					size={iSize.Large}
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
