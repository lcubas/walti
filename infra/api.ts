import { router } from "./router";
import { secrets } from "./secrets";

export const api = new sst.aws.Function("Api", {
	handler: "apps/api/src/lambda.handler",
	url: {
		router: {
			instance: router,
			path: "/api",
			// Hono mounts its routes at the root, so the prefix only exists at the CDN.
			rewrite: {
				regex: "^/api/(.*)$",
				to: "/$1",
			},
		},
	},
	// Passed as plain env vars so config/env.ts keeps reading process.env unchanged.
	environment: {
		APP_ENV: "production",
		SESSION_NAME: "walti.session",
		SESSION_MAX_AGE_IN_SECONDS: "2592000",
		// Web and API share an origin in production; CORS only matters for local dev.
		ALLOWED_ORIGINS: router.url,
		TURSO_DATABASE_URL: secrets.tursoDatabaseUrl.value,
		TURSO_AUTH_TOKEN: secrets.tursoAuthToken.value,
		SESSION_SECRET: secrets.sessionSecret.value,
		GOOGLE_CLIENT_ID: secrets.googleClientId.value,
		ALLOWED_EMAILS: secrets.allowedEmails.value,
	},
});
