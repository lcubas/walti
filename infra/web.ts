import { router } from "./router";
import { secrets } from "./secrets";

export const web = new sst.aws.StaticSite("Web", {
	path: "apps/web",
	router: {
		instance: router,
	},
	build: {
		command: "pnpm build",
		output: "dist",
	},
	environment: {
		VITE_API_URL: $interpolate`${router.url}/api`,
		VITE_GOOGLE_CLIENT_ID: secrets.googleClientId.value,
	},
});
