"use client";
import React from "react";
import styles from "./auth.module.css";
import LoginForm from "@/components/auth/LoginForm";
import { useSearchParams } from "next/navigation";
import Container from "@/components/common/container";
import { CarouselDApiSlider } from "@/components/TopBanner/slider";
import { useWebSocket } from "@/context/WebSocketProvider";

type iformType = "sign-in" | "sign-up";

const AuthPage: React.FC = () => {
	const searchParams = useSearchParams();
	const { items } = useWebSocket();

	const type: iformType = (searchParams?.get("type") as iformType) || "sign-in";
	return (
		<>
			<Container>
				<div className={styles.AuthPage}>
					<div className={styles.authForm}>
						<LoginForm formType={type} />{" "}
						{/* Updated to use the type from searchParams */}
					</div>
					<div className={styles.reviews}>
						<CarouselDApiSlider items={items} />
					</div>
				</div>
			</Container>
		</>
	);
};

export default AuthPage;
