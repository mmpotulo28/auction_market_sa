import React from "react";

interface numProp {
	num: string | number;
	unit: string;
}

export const NumberBox = ({ num, unit }: numProp) => {
	return (
		<div className="flex flex-col items-center mt-4 px-0">
			<div className=" relative bg-transparent flex flex-col items-center justify-center rounded-lg w-12 h-12 text-1xl md:text-1xl mt-4 ">
				<div className="rounded-t-lg rounded-b-lg bg-[#343650] w-full h-full"></div>

				<div
					style={{ color: "var(--color-foreground)" }}
					className="text-3xl absolute z-10 font-bold font-redhat md:text-3xl font-mono ">
					{num}
				</div>

				<div className=" rounded-b-lg rounded-t-lg bg-[#2c2e3f] w-full h-full"></div>
			</div>
			<p
				style={{ color: "var(--color-foreground)" }}
				className="text-lg mt-3 font-semibold md:text-1xl ">
				{unit}
			</p>
		</div>
	);
};
