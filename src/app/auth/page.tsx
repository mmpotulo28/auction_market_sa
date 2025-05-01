"use client";
import React from "react";
import styles from "./auth.module.css";
import { iSize } from "@/lib/types";
import Banner from "../../components/Banner";
import LoginForm from "@/components/auth/LoginForm";
import { useSearchParams } from "next/navigation";
import Container from "@/components/common/container";
import { CarouselDApiSlider } from "@/components/TopBanner/slider";

type iformType = "login" | "signup";

const AuthPage: React.FC = () => {
	// get the type search parameter from the URL
	const searchParams = useSearchParams();

	const type: iformType = (searchParams?.get("type") as iformType) || "login";
	return (
		<>
			<Container>
				<div className={styles.AuthPage}>
					<div className={styles.authForm}>
						<LoginForm formType={type} />{" "}
						{/* Updated to use the type from searchParams */}
					</div>
					<div className={styles.reviews}>
						<CarouselDApiSlider />
					</div>
				</div>
			</Container>

			<Banner
				title={"Report Ticket System Issues"}
				content={"Encountered a problem? Let us know!"}
				size={iSize.Medium}
				image={{
					src: "/2b4e75d0-a0ad-406f-bf0b-912565d7a155 (1).jpg",
					alt: "Report Issue Banner Background",
				}}
				actions={[]}
			/>
		</>
	);
};

export default AuthPage;
