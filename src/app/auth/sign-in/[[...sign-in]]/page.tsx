import React from "react";
import styles from "@/app/auth/auth.module.css";
import LoginForm from "@/components/auth/LoginForm";
import Container from "@/components/common/container";
import CustomerAd from "@/components/ads/CustomerAd";

const LoginPage: React.FC = () => {
	return (
		<Container>
			<div className={styles.AuthPage}>
				<LoginForm formType={"sign-in"} />
				<div className={styles.reviews}>
					{/* <CarouselDApiSlider items={items} /> */}
					<CustomerAd />
				</div>
			</div>
		</Container>
	);
};

export default LoginPage;
