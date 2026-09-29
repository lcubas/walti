export const secrets = {
	tursoDatabaseUrl: new sst.Secret("TursoDatabaseUrl"),
	tursoAuthToken: new sst.Secret("TursoAuthToken"),
	sessionSecret: new sst.Secret("SessionSecret"),
	googleClientId: new sst.Secret("GoogleClientId"),
	allowedEmails: new sst.Secret("AllowedEmails"),
};
