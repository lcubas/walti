import { Loader2 } from 'lucide-react';
import { useGoogleButton } from '@/features/auth/hooks/useGoogleButton';
import { useSignIn } from '@/features/auth/hooks/useSignIn';
import { ApiError } from '@/shared/api/apiError';
import { ErrorState } from '@/shared/components/errorState';

const scriptError = new ApiError(
	'network_error',
	'No pudimos cargar el acceso con Google.',
	0,
);

export const LoginScreen = () => {
	const signIn = useSignIn();

	const { containerRef, scriptFailed } = useGoogleButton((idToken) => {
		signIn.reset();
		signIn.mutate(idToken);
	});

	return (
		<main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6 text-center">
			<h1 className="text-3xl font-semibold tracking-tight">Walti</h1>

			<p className="mt-2 text-sm text-balance text-muted-foreground">
				Tus gastos, los de casa, y a dónde se va el mes.
			</p>

			<div className="mt-10 flex justify-center">
				<div
					ref={containerRef}
					className={
						signIn.isPending ? 'pointer-events-none opacity-40' : undefined
					}
				/>
			</div>

			{signIn.isPending ? (
				<p
					role="status"
					className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
				>
					<Loader2 className="size-4 animate-spin" aria-hidden="true" />
					Entrando…
				</p>
			) : null}

			{scriptFailed ? <ErrorState error={scriptError} /> : null}

			{signIn.error ? (
				<>
					<ErrorState error={signIn.error} />
					<p className="text-sm text-muted-foreground">
						Puedes intentarlo con otra cuenta.
					</p>
				</>
			) : null}
		</main>
	);
};
