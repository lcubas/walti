import { queryOptions } from '@tanstack/react-query';
import {
	type CreatePaymentSourceRequest,
	PaymentSource,
	PaymentSourceList,
	type RenamePaymentSourceRequest,
} from '@walti/shared';
import { request, requestNoContent } from '@/shared/api/httpClient';

export const paymentSourcesQueryKey = ['paymentSources'] as const;

export const paymentSourcesQuery = queryOptions({
	queryKey: paymentSourcesQueryKey,
	queryFn: ({ signal }) =>
		request('/v1/payment-sources', PaymentSourceList, { signal }),
});

export const createPaymentSource = (body: CreatePaymentSourceRequest) =>
	request('/v1/payment-sources', PaymentSource, { method: 'POST', body });

export const renamePaymentSource = (
	paymentSourceId: string,
	body: RenamePaymentSourceRequest,
) =>
	requestNoContent(`/v1/payment-sources/${paymentSourceId}`, {
		method: 'PATCH',
		body,
	});

export const setPaymentSourceArchived = (
	paymentSourceId: string,
	archived: boolean,
) =>
	requestNoContent(`/v1/payment-sources/${paymentSourceId}/archive`, {
		method: 'PATCH',
		body: { archived },
	});
