import { secrets } from "./secrets";

export const api = new sst.aws.Function("Api", {
	handler: "apps/api/src/lambda.handler",
	// A Function URL avoids paying for API Gateway.
	url: true,
	// Passed as plain env vars so config/env.ts keeps reading process.env unchanged.
	environment: {
		APP_ENV: "production",
		SESSION_NAME: "walti.session",
		SESSION_MAX_AGE_IN_SECONDS: "2592000",
		TURSO_DATABASE_URL: secrets.tursoDatabaseUrl.value,
		TURSO_AUTH_TOKEN: secrets.tursoAuthToken.value,
		SESSION_SECRET: secrets.sessionSecret.value,
		GOOGLE_CLIENT_ID: secrets.googleClientId.value,
		ALLOWED_EMAILS: secrets.allowedEmails.value,
		ALLOWED_ORIGINS: secrets.allowedOrigins.value,
	},
});
