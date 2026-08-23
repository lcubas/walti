import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export type SuccessBody<T> = { data: T };

export type ErrorBody = {
	error: {
		code: string;
		message: string;
		details?: { field: string; message: string }[];
	};
};

export const respond = <T>(
	c: Context,
	data: T,
	status: ContentfulStatusCode = 200,
) => c.json<SuccessBody<T>>({ data }, status);

export const ok = <T>(c: Context, data: T) => respond(c, data, 200);

export const created = <T>(c: Context, data: T) => respond(c, data, 201);

export const errorBody = (
	code: string,
	message: string,
	details?: ErrorBody['error']['details'],
): ErrorBody => ({
	error: details ? { code, message, details } : { code, message },
});
