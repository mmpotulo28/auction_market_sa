"use client";
import React from "react";
import styles from "./loginForm.module.css";
import Link from "next/link";
import { SignIn, SignUp } from "@stackframe/stack";

interface AuthFormProps {
	formType: "login" | "signup";
}

const AuthForm: React.FC<AuthFormProps> = ({ formType }) => {
	return (
		<div className={styles.authForm}>
			{formType == "login" ? (
				<SignIn
					extraInfo={
						<div className={styles.extraInfo}>
							<p>
								By logging in, you agree to our{" "}
								<Link
									target="_blank"
									className={styles.link}
									href="/policies/ticket-buyer">
									buyer T&C&apos;s
								</Link>
							</p>
						</div>
					}
				/>
			) : (
				<SignUp
					extraInfo={
						<div className={styles.extraInfo}>
							<p>
								By signing up, you agree to our{" "}
								<Link
									target="_blank"
									className={styles.link}
									href="/policies/ticket-buyer">
									buyer T&C&apos;s
								</Link>
							</p>
						</div>
					}
				/>
			)}
		</div>
	);
};

export default AuthForm;
