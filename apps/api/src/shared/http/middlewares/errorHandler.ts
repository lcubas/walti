import type { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { AppError } from '../../errors/appError';

type ErrorBody = {
	code: string;
	message: string;
	details?: { field: string; message: string }[];
};

export const buildErrorBody = (
	code: string,
	message: string,
	details?: ErrorBody['details'],
): ErrorBody => (details ? { code, message, details } : { code, message });

export const errorHandler: ErrorHandler = (error, c) => {
	if (error instanceof AppError) {
		return c.json(
			buildErrorBody(error.code, error.message, error.details),
			error.status as ContentfulStatusCode,
		);
	}

	if (error instanceof HTTPException) {
		return c.json(buildErrorBody('http_error', error.message), error.status);
	}

	console.error(error);
	return c.json(buildErrorBody('internal_error', 'Something went wrong.'), 500);
};
