import { AppError } from './appError';

export type ValidationDetail = {
	field: string;
	message: string;
};

export class ValidationError extends AppError<ValidationDetail[]> {
	readonly status = 422;

	constructor(details: ValidationDetail[]) {
		super('validation_error', 'The request payload is invalid.', details);
	}
}
