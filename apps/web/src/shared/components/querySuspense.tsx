import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary } from '@/shared/components/errorBoundary';
import { ErrorState } from '@/shared/components/errorState';

type QuerySuspenseProps = {
	children: ReactNode;
	/** Shown while any `useSuspenseQuery` inside `children` is in flight. */
	loading: ReactNode;
	/**
	 * Changing this clears a stuck error the moment its cause changes (a
	 * different space id, say), the same way TanStack Query's own
	 * `resetKeys` are used elsewhere. Optional: most call sites remount
	 * `children` anyway when their inputs change.
	 */
	resetKeys?: readonly unknown[];
};

export const QuerySuspense = ({
	children,
	loading,
	resetKeys,
}: QuerySuspenseProps) => (
	<QueryErrorResetBoundary>
		{({ reset: resetQueries }) => (
			<ErrorBoundary
				resetKeys={resetKeys}
				fallback={(error, resetBoundary) => (
					<ErrorState
						error={error}
						onRetry={() => {
							resetQueries();
							resetBoundary();
						}}
					/>
				)}
			>
				<Suspense fallback={loading}>{children}</Suspense>
			</ErrorBoundary>
		)}
	</QueryErrorResetBoundary>
);
