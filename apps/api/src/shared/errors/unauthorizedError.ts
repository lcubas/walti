import { AppError } from './appError';

export class UnauthorizedError extends AppError {
	readonly status = 401;
}
