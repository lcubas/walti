// Serving web and API from the same CloudFront origin keeps the session cookie first-party.
export const router = new sst.aws.Router("Router");
