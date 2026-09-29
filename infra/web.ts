import { api } from "./api";
import { secrets } from "./secrets";

export const web = new sst.aws.StaticSite("Web", {
	path: "apps/web",
	build: {
		command: "pnpm build",
		output: "dist",
	},
	environment: {
		VITE_API_URL: api.url,
		VITE_GOOGLE_CLIENT_ID: secrets.googleClientId.value,
	},
});
