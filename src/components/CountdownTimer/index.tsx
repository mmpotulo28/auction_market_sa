"use client";

import React, { useEffect, useState } from "react";
import styles from "./countdown-timer.module.css";

interface CountdownTimerProps {
	dateTime: Date;
	duration?: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ dateTime }) => {
	const [timeLeft, setTimeLeft] = useState({
		months: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		const calculateTimeLeft = () => {
			const now = new Date();
			const difference = new Date(dateTime).getTime() - now.getTime();

			if (difference > 0) {
				const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
				const days = Math.floor((difference / (1000 * 60 * 60 * 24)) % 30);
				const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
				const minutes = Math.floor((difference / (1000 * 60)) % 60);
				const seconds = Math.floor((difference / 1000) % 60);

				setTimeLeft({ months, days, hours, minutes, seconds });
			} else {
				setTimeLeft({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
			}
		};

		const timer = setInterval(calculateTimeLeft, 1000);
		return () => clearInterval(timer);
	}, [dateTime]);

	return (
		<div className={styles.timer}>
			<span className={styles.timeBlock}>{timeLeft.months}m</span>
			<span className={styles.timeBlock}>{timeLeft.days}d</span>
			<span className={styles.timeBlock}>{timeLeft.hours}h</span>
			<span className={styles.timeBlock}>{timeLeft.minutes}m</span>
			<span className={styles.timeBlock}>{timeLeft.seconds}s</span>
		</div>
	);
};

export default CountdownTimer;
