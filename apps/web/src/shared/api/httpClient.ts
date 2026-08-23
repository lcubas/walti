import * as v from 'valibot';
import { env } from '@/config/env';
import { ApiError, type ApiErrorDetail } from '@/shared/api/apiError';

const ErrorBody = v.object({
	error: v.object({
		code: v.string(),
		message: v.string(),
		details: v.optional(
			v.array(v.object({ field: v.string(), message: v.string() })),
		),
	}),
});

const SuccessBody = v.object({ data: v.unknown() });

const toDetails = (
	issues: [v.BaseIssue<unknown>, ...v.BaseIssue<unknown>[]],
): ApiErrorDetail[] =>
	issues.map((issue) => ({
		field: issue.path?.map((segment) => String(segment.key)).join('.') ?? '',
		message: issue.message,
	}));

type RequestOptions = {
	method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	body?: unknown;
	signal?: AbortSignal;
};

export const request = async <TSchema extends v.GenericSchema>(
	path: string,
	schema: TSchema,
	options: RequestOptions = {},
): Promise<v.InferOutput<TSchema>> => {
	let response: Response;

	try {
		response = await fetch(`${env.VITE_API_URL}${path}`, {
			method: options.method ?? 'GET',
			headers: options.body
				? { 'Content-Type': 'application/json' }
				: undefined,
			body: options.body ? JSON.stringify(options.body) : undefined,
			credentials: 'include',
			signal: options.signal,
		});
	} catch {
		throw new ApiError(
			'network_error',
			'No se pudo contactar con el servidor.',
			0,
		);
	}

	const payload: unknown = await response.json().catch(() => null);

	if (!response.ok) {
		const failure = v.safeParse(ErrorBody, payload);

		if (!failure.success) {
			throw new ApiError(
				'unexpected_error',
				'El servidor devolvió una respuesta inesperada.',
				response.status,
			);
		}

		const { code, message, details } = failure.output.error;
		throw new ApiError(code, message, response.status, details ?? []);
	}

	const envelope = v.safeParse(SuccessBody, payload);

	if (!envelope.success) {
		throw new ApiError(
			'contract_violation',
			'La respuesta del servidor no sigue el contrato.',
			response.status,
		);
	}

	const result = v.safeParse(schema, envelope.output.data);

	if (!result.success) {
		throw new ApiError(
			'contract_violation',
			'La respuesta del servidor no coincide con el contrato.',
			response.status,
			toDetails(result.issues),
		);
	}

	return result.output;
};
