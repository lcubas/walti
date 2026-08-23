import { AppError } from './appError';

export class NotFoundError extends AppError {
	readonly status = 404;
}
