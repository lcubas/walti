import { toast } from '@/components/ui/toast';
import { ApiError } from '@/shared/api/apiError';

/** Confirms an action the user just took. The title says what happened, in past tense. */
export const notifyDone = (title: string, description?: string) =>
	toast.add({ type: 'success', title, description });

/** Reports an action that failed. Never swallows the reason. */
export const notifyFailed = (title: string, error?: unknown) =>
	toast.add({
		type: 'error',
		title,
		description: error instanceof ApiError ? error.message : undefined,
	});
