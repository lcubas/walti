export abstract class AppError<TDetails = undefined> extends Error {
	abstract readonly status: number;

	constructor(
		readonly code: string,
		readonly message: string,
		readonly details?: TDetails,
	) {
		super(message);
		this.name = new.target.name;
	}
}
