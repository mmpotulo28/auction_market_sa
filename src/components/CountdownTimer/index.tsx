import React, { useEffect, useState } from "react";
import { NumberBox } from "./NumberBox";
import styles from "./countdown-timer.module.css";

interface timeProps {
	targetDate: string; // Target date in string format
}

export const TimerContainer = ({ targetDate }: timeProps) => {
	const [time, setTime] = useState({
		months: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		const calculateTimeLeft = () => {
			const now = new Date();
			const target = new Date(targetDate);

			let months =
				target.getMonth() -
				now.getMonth() +
				12 * (target.getFullYear() - now.getFullYear());
			let days = target.getDate() - now.getDate();
			let hours = target.getHours() - now.getHours();
			let minutes = target.getMinutes() - now.getMinutes();
			let seconds = target.getSeconds() - now.getSeconds();

			if (seconds < 0) {
				seconds += 60;
				minutes -= 1;
			}
			if (minutes < 0) {
				minutes += 60;
				hours -= 1;
			}
			if (hours < 0) {
				hours += 24;
				days -= 1;
			}
			if (days < 0) {
				const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
				days += prevMonth.getDate();
				months -= 1;
			}
			if (months < 0) {
				months += 12;
			}

			if (target.getTime() <= now.getTime()) {
				setTime({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
			} else {
				setTime({ months, days, hours, minutes, seconds });
			}
		};

		const interval = setInterval(calculateTimeLeft, 1000);

		return () => clearInterval(interval);
	}, [targetDate]);

	const { months, days, hours, minutes, seconds } = time;

	return (
		<div className={styles.timerContainer}>
			<div className={styles.timerGrid}>
				<NumberBox num={months} unit="Mon" />
				<span className={styles.colon}>:</span>
				<NumberBox num={days} unit="Dys" />
				<span className={styles.colon}>:</span>
				<NumberBox num={hours} unit="Hrs" />
				<span className={styles.colon}>:</span>
				<NumberBox num={minutes} unit="Min" />
				<span className={styles.colon}>:</span>
				<NumberBox num={seconds} unit="Sec" />
			</div>
		</div>
	);
};
