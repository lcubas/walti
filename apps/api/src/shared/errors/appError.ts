export abstract class AppError extends Error {
	abstract readonly status: number;

	constructor(
		readonly code: string,
		message: string,
	) {
		super(message);
		this.name = new.target.name;
	}
}
