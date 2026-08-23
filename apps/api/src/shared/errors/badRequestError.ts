import { AppError } from './appError';

export class BadRequestError extends AppError {
	readonly status = 400;
}
