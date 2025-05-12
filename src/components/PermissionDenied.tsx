import React from "react";
import styles from "./PermissionDenied.module.css";

const PermissionDenied: React.FC = () => {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Access Denied</h1>
			<p className={styles.message}>
				You do not have the necessary permissions to view this page.
			</p>
		</div>
	);
};

export default PermissionDenied;
