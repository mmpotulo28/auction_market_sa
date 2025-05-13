"use client";
import React from "react";
import styles from "@/app/auth/auth.module.css";
import LoginForm from "@/components/auth/LoginForm";
import Container from "@/components/common/container";
import { CarouselDApiSlider } from "@/components/TopBanner/slider";
import { useWebSocket } from "@/context/WebSocketProvider";

const LoginPage: React.FC = () => {
	const { items } = useWebSocket();

	return (
		<>
			<Container>
				<div className={styles.AuthPage}>
					<div className={styles.authForm}>
						<LoginForm formType={"sign-up"} />
					</div>
					<div className={styles.reviews}>
						<CarouselDApiSlider items={items} />
					</div>
				</div>
			</Container>
		</>
	);
};

export default LoginPage;
