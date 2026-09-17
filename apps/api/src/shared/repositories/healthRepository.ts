export interface HealthRepository {
	/**
	 * Runs a trivial query to confirm the database answers.
	 *
	 * @throws If the database is unreachable or rejects the query.
	 */
	ping(): Promise<void>;
}
