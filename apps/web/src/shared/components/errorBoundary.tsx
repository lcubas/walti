import { Component, type ReactNode } from 'react';

type ErrorBoundaryProps = {
	children: ReactNode;
	/** Renders in place of the crashed subtree. `reset` clears the error. */
	fallback: (error: unknown, reset: () => void) => ReactNode;
	/**
	 * When any value here changes, the boundary clears itself and gives the
	 * subtree another try — the same idea as TanStack Query's own resetKeys,
	 * so a boundary wrapping a query that just got new arguments (a
	 * different space, say) does not stay stuck showing an old error.
	 */
	resetKeys?: readonly unknown[];
};

type ErrorBoundaryState = { error: unknown };

const initialState: ErrorBoundaryState = { error: null };

/**
 * A plain React error boundary (native since React 16 — no dependency).
 * Catches render/lifecycle errors thrown by its subtree, including the
 * rejected promise a suspended `useSuspenseQuery` rethrows as an error.
 * Pair it with `QueryErrorResetBoundary` (see `querySuspense.tsx`) so
 * "reintentar" actually clears TanStack Query's own do-not-retry latch
 * before asking this boundary to render the subtree again.
 */
export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state = initialState;

	static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
		return { error };
	}

	componentDidUpdate(previousProps: ErrorBoundaryProps) {
		if (this.state.error === null) {
			return;
		}

		const previousKeys = previousProps.resetKeys ?? [];
		const nextKeys = this.props.resetKeys ?? [];
		const changed =
			previousKeys.length !== nextKeys.length ||
			nextKeys.some((key, index) => key !== previousKeys[index]);

		if (changed) {
			this.reset();
		}
	}

	reset = () => {
		this.setState(initialState);
	};

	render() {
		if (this.state.error !== null) {
			return this.props.fallback(this.state.error, this.reset);
		}

		return this.props.children;
	}
}
