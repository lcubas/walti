import * as v from 'valibot';

export const GoogleSignInRequest = v.object({
	idToken: v.pipe(v.string(), v.nonEmpty()),
});

export type GoogleSignInRequest = v.InferOutput<typeof GoogleSignInRequest>;

export const SessionUser = v.object({
	id: v.string(),
	email: v.pipe(v.string(), v.email()),
	name: v.string(),
	avatarUrl: v.nullable(v.string()),
});

export type SessionUser = v.InferOutput<typeof SessionUser>;
