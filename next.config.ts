import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "udsbdddfarrckxeiupiv.supabase.co",
				pathname: "/storage/v1/object/public/**", // Match the specific path pattern
			},
		],
	},
};

module.exports = nextConfig;

export default nextConfig;
