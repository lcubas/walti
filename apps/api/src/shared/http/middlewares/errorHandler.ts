import type { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { ValiError } from 'valibot';
import { AppError } from '../../errors/appError';
import { errorBody } from '../response';

export const errorHandler: ErrorHandler = (error, c) => {
	if (error instanceof ValiError) {
		const details = error.issues.map((issue) => ({
			field:
				issue.path
					?.map((segment: { key: unknown }) => String(segment.key))
					.join('.') ?? '',
			message: issue.message,
		}));
		return c.json(
			errorBody('validation_error', 'The request payload is invalid.', details),
			400,
		);
	}

	if (error instanceof AppError) {
		return c.json(
			errorBody(error.code, error.message),
			error.status as ContentfulStatusCode,
		);
	}

	if (error instanceof HTTPException) {
		return c.json(errorBody('http_error', error.message), error.status);
	}

	console.error(error);
	return c.json(errorBody('internal_error', 'Something went wrong.'), 500);
};
