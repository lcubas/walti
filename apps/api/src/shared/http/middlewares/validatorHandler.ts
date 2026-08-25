import { validator as honoValidator } from 'hono/validator';
import * as v from 'valibot';
import type { ValidationTargets } from 'hono';
import { ValidationError } from '../../errors/validationError';

type Schema = v.GenericSchema | v.GenericSchemaAsync;

const createValidator = <
	TTarget extends keyof ValidationTargets,
	TSchema extends Schema,
>(
	target: TTarget,
	schema: TSchema,
) =>
	honoValidator(target, async (value): Promise<v.InferOutput<TSchema>> => {
		const result = await v.safeParseAsync(schema, value);

		if (!result.success) {
			throw new ValidationError(
				result.issues.map((issue) => ({
					field: v.getDotPath(issue) ?? '',
					message: issue.message,
				})),
			);
		}

		return result.output;
	});

export const validatorHandler = {
	json: <TSchema extends Schema>(schema: TSchema) =>
		createValidator('json', schema),

	form: <TSchema extends Schema>(schema: TSchema) =>
		createValidator('form', schema),
};
