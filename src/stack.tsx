import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
	tokenStore: "nextjs-cookie",
	urls: {
		handler: "/auth-ext",
		signIn: "/auth?type=login",
		signUp: "/auth?type=signup",
	},
});
