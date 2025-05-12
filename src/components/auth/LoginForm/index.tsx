"use client";
import React from "react";
import styles from "./loginForm.module.css";
import { SignIn, SignUp } from "@clerk/nextjs";

interface AuthFormProps {
	formType: "sign-in" | "sign-up";
}

const AuthForm: React.FC<AuthFormProps> = ({ formType }) => {
	return (
		<div className={styles.authForm}>
			{formType == "sign-in" ? <SignIn withSignUp={false} /> : <SignUp />}
		</div>
	);
};

export default AuthForm;
