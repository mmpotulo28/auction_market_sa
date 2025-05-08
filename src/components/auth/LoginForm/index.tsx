"use client";
import React from "react";
import styles from "./loginForm.module.css";
import Link from "next/link";
import { SignIn, SignUp } from "@clerk/nextjs";

interface AuthFormProps {
	formType: "sign-in" | "sign-up";
}

const AuthForm: React.FC<AuthFormProps> = ({ formType }) => {
	return (
		<div className={styles.authForm}>
			{formType == "sign-in" ? <SignIn withSignUp={false} /> : <SignUp />}
			<div className={styles.extraInfo}>
				<p>
					By logging in, you agree to our{" "}
					<Link target="_blank" className={styles.link} href="/policies/ticket-buyer">
						buyer T&C&apos;s
					</Link>
				</p>
			</div>
		</div>
	);
};

export default AuthForm;
