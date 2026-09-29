export const secrets = {
	tursoDatabaseUrl: new sst.Secret("TursoDatabaseUrl"),
	tursoAuthToken: new sst.Secret("TursoAuthToken"),
	sessionSecret: new sst.Secret("SessionSecret"),
	googleClientId: new sst.Secret("GoogleClientId"),
	allowedEmails: new sst.Secret("AllowedEmails"),
	// Filled in after the first deploy, once the CloudFront URL is known.
	allowedOrigins: new sst.Secret("AllowedOrigins"),
};
