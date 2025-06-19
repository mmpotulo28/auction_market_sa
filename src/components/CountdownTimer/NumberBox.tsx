import React from "react";
import styles from "./countdown-timer.module.css";

interface numProp {
	num: string | number;
	unit: string;
}

export const NumberBox = ({ num, unit }: numProp) => {
	return (
		<div className={styles.numberBox}>
			<div className={styles.numberBoxInner}>
				<div className={styles.numberBoxTop}></div>
				<div className={styles.numberBoxNum}>{num}</div>
				<div className={styles.numberBoxBottom}></div>
			</div>
			<p className={styles.numberBoxUnit}>{unit}</p>
		</div>
	);
};
