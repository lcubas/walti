import { AppError } from './appError';

export class ForbiddenError extends AppError {
	readonly status = 403;
}
