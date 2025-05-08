"use client";
import React from "react";
import styles from "@/app/auth/auth.module.css";
import LoginForm from "@/components/auth/LoginForm";
import Container from "@/components/common/container";
import { CarouselDApiSlider } from "@/components/TopBanner/slider";
import { mockItems } from "@/lib/dummy-data";

const LoginPage: React.FC = () => {
	return (
		<>
			<Container>
				<div className={styles.AuthPage}>
					<div className={styles.authForm}>
						<LoginForm formType={"sign-in"} />
					</div>
					<div className={styles.reviews}>
						<CarouselDApiSlider items={mockItems} />
					</div>
				</div>
			</Container>
		</>
	);
};

export default LoginPage;
