import React, { useEffect, useState } from "react";
import { NumberBox } from "./NumberBox";

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
		<div
			// style={{ backgroundColor: "var(--color-foreground)" }}
			className=" mt-0 md:mt-0 rounded-xl">
			<div className="grid grid-cols-2 gap-1 py-0 px-10 md:flex items-center md:items-center md:justify-between md:mt-0 rounded-xl md:px-2 md:py-0 ">
				<NumberBox num={months} unit="Mon" />
				<span className=" hidden text-2xl -mt-8 md:inline-block md:text-4xl font-normal text-gray-50 ">
					:
				</span>
				<NumberBox num={days} unit="Dys" />
				<span className=" hidden text-2xl -mt-8 md:inline-block md:text-4xl font-normal text-gray-50 ">
					:
				</span>
				<NumberBox num={hours} unit="Hrs" />
				<span className="hidden text-2xl -mt-8 md:inline-block md:text-4xl font-normal text-gray-50 ">
					:
				</span>
				<NumberBox num={minutes} unit="Min" />
				<span className="hidden text-2xl -mt-8 md:inline-block md:text-4xl font-normal text-gray-50 ">
					:
				</span>
				<NumberBox num={seconds} unit="Sec" />
			</div>
		</div>
	);
};
