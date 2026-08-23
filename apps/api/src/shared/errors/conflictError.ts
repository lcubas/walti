import { AppError } from './appError';

export class ConflictError extends AppError {
	readonly status = 409;
}
