"use client";
import React from "react";
import styles from "./auth.module.css";
import LoginForm from "@/components/auth/LoginForm";
import { useSearchParams } from "next/navigation";
import Container from "@/components/common/container";
import { CarouselDApiSlider } from "@/components/TopBanner/slider";
import { mockItems } from "@/lib/dummy-data";

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
						<CarouselDApiSlider items={mockItems} />
					</div>
				</div>
			</Container>
		</>
	);
};

export default AuthPage;
