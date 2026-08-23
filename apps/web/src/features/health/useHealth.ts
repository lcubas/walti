import { useQuery } from '@tanstack/react-query';
import { HealthReport } from '@walti/shared';
import { request } from '@/shared/api/httpClient';

export const useHealth = () =>
	useQuery({
		queryKey: ['health'],
		queryFn: ({ signal }) => request('/health', HealthReport, { signal }),
	});
