import { stackServerApp } from "@/stack";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const user = await stackServerApp.getUser();
	if (!user) {
		const redirectUrl = new URL("/auth/sign-in", request.url);
		redirectUrl.searchParams.set(
			"after_auth_return_to",
			`${request.nextUrl.pathname}${request.nextUrl.search}`,
		);
		return NextResponse.redirect(redirectUrl);
	}
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/checkout/:path*", // Protect checkout routes
		"/auction/:path*", // Protect auction routes
	],
};
