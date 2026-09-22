import * as v from 'valibot';

const paymentSourceName = v.pipe(
	v.string(),
	v.trim(),
	v.nonEmpty('Ponle un nombre a la fuente de pago.'),
	v.maxLength(50, 'El nombre no puede pasar de 50 caracteres.'),
);

export const PaymentSource = v.object({
	id: v.string(),
	name: v.string(),
	/** Null means active. */
	archivedAt: v.nullable(v.string()),
});

export type PaymentSource = v.InferOutput<typeof PaymentSource>;

export const PaymentSourceList = v.array(PaymentSource);

export type PaymentSourceList = v.InferOutput<typeof PaymentSourceList>;

export const PaymentSourceIdParam = v.object({
	paymentSourceId: v.pipe(v.string(), v.uuid()),
});

export type PaymentSourceIdParam = v.InferOutput<typeof PaymentSourceIdParam>;

export const CreatePaymentSourceRequest = v.object({ name: paymentSourceName });

export type CreatePaymentSourceRequest = v.InferOutput<
	typeof CreatePaymentSourceRequest
>;

export const RenamePaymentSourceRequest = v.object({ name: paymentSourceName });

export type RenamePaymentSourceRequest = v.InferOutput<
	typeof RenamePaymentSourceRequest
>;
