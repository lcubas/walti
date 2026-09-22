import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { CreatePaymentSourceRequest } from '@walti/shared';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCreatePaymentSource } from '@/features/paymentSources/hooks/usePaymentSourceMutations';
import { NameForm } from '@/shared/components/nameForm';
import { ErrorState } from '@/shared/components/errorState';
import { LoadingState } from '@/shared/components/loadingState';
import { paymentSourcesQuery } from '@/features/paymentSources/paymentSourcesApi';
import { PaymentSourceRow } from '@/features/paymentSources/paymentSourceRow';

/**
 * Embedded in the account screen, not a screen of its own: the payment
 * source hangs off the person (Arquitectura web §5), and that screen is
 * already where "Perfil y fuentes de pago" lives.
 */
export const PaymentSourcesSection = () => {
	const paymentSources = useQuery(paymentSourcesQuery);
	const [creating, setCreating] = useState(false);
	const create = useCreatePaymentSource();

	if (paymentSources.isPending) {
		return <LoadingState rows={2} label="Cargando tus fuentes de pago" />;
	}

	if (paymentSources.isError) {
		return (
			<ErrorState
				error={paymentSources.error}
				onRetry={() => paymentSources.refetch()}
			/>
		);
	}

	// Archived ones count too: freeing the name would only move the clash to
	// the moment the source comes back.
	const otherNames = (paymentSourceId: string) =>
		paymentSources.data
			.filter((source) => source.id !== paymentSourceId)
			.map((source) => source.name);

	const active = paymentSources.data.filter((source) => !source.archivedAt);
	const archived = paymentSources.data.filter((source) => source.archivedAt);

	return (
		<div className="space-y-4">
			{creating ? (
				<div className="rounded-xl border border-border p-3">
					<NameForm
						schema={CreatePaymentSourceRequest}
						placeholder="Visa BCP"
						duplicateMessage="Ya tienes una fuente de pago con ese nombre."
						label="Nombre de la fuente de pago"
						submitLabel="Crear fuente de pago"
						takenNames={paymentSources.data.map((source) => source.name)}
						pending={create.isPending}
						onCancel={() => setCreating(false)}
						onSubmit={(name) =>
							create.mutate(name, { onSuccess: () => setCreating(false) })
						}
					/>
				</div>
			) : (
				<Button onClick={() => setCreating(true)}>
					<Plus className="size-4" aria-hidden="true" />
					Añadir fuente de pago
				</Button>
			)}

			{active.length === 0 && archived.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					Todavía no tienes fuentes de pago. Son opcionales pero dan contexto a
					un gasto, como con qué tarjeta o cuenta pagaste.
				</p>
			) : (
				<ul className="space-y-2">
					{active.map((source) => (
						<PaymentSourceRow
							key={source.id}
							paymentSource={source}
							takenNames={otherNames(source.id)}
						/>
					))}
				</ul>
			)}

			{archived.length > 0 ? (
				<section className="space-y-2">
					<h3 className="text-sm font-medium text-muted-foreground">
						Archivadas
					</h3>

					<ul className="space-y-2">
						{archived.map((source) => (
							<PaymentSourceRow
								key={source.id}
								paymentSource={source}
								takenNames={otherNames(source.id)}
							/>
						))}
					</ul>
				</section>
			) : null}
		</div>
	);
};
