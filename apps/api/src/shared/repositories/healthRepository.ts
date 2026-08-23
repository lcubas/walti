export interface HealthRepository {
	/** Throws if the database is unreachable. */
	ping(): Promise<void>;
}
