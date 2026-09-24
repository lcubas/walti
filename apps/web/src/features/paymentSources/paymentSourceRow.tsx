import { Archive, ArchiveRestore, CreditCard, Pencil } from 'lucide-react';
import { type PaymentSource, RenamePaymentSourceRequest } from '@walti/shared';
import { useState } from 'react';
import {
	useArchivePaymentSource,
	useRenamePaymentSource,
	useUnarchivePaymentSource,
} from '@/features/paymentSources/hooks/usePaymentSourceMutations';
import { ArchivedBadge } from '@/shared/components/archivedBadge';
import { NameForm } from '@/shared/components/nameForm';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/shared/components/confirmDialog';
import { rowActionButtonClasses as actionClasses } from '@/shared/styles/rowActionButtonClasses';

type PaymentSourceRowProps = {
	paymentSource: PaymentSource;
	/** Every other payment source of this user, so renaming cannot land on one. */
	takenNames: string[];
};

export const PaymentSourceRow = ({
	paymentSource,
	takenNames,
}: PaymentSourceRowProps) => {
	const [renaming, setRenaming] = useState(false);
	const rename = useRenamePaymentSource();
	const archive = useArchivePaymentSource();
	const unarchive = useUnarchivePaymentSource();

	if (renaming) {
		return (
			<li className="rounded-xl border border-border p-3">
				<NameForm
					schema={RenamePaymentSourceRequest}
					placeholder="Visa BCP"
					duplicateMessage="Ya tienes una fuente de pago con ese nombre."
					label="Nombre de la fuente de pago"
					submitLabel="Guardar"
					initialName={paymentSource.name}
					takenNames={takenNames}
					pending={rename.isPending}
					onCancel={() => setRenaming(false)}
					onSubmit={(name) =>
						rename.mutate(
							{ paymentSourceId: paymentSource.id, name },
							{ onSuccess: () => setRenaming(false) },
						)
					}
				/>
			</li>
		);
	}

	return (
		<li className="flex items-center gap-3 rounded-xl border border-border p-3">
			<CreditCard
				className="size-5 shrink-0 text-muted-foreground"
				aria-hidden="true"
			/>

			<span className="flex min-w-0 flex-1 flex-col">
				<span
					className={cn(
						'truncate text-sm font-medium',
						paymentSource.archivedAt && 'text-muted-foreground',
					)}
				>
					{paymentSource.name}
				</span>
			</span>

			{paymentSource.archivedAt ? <ArchivedBadge label="Archivada" /> : null}

			{paymentSource.archivedAt ? (
				<button
					type="button"
					onClick={() => unarchive.mutate(paymentSource.id)}
					disabled={unarchive.isPending}
					aria-label={`Recuperar ${paymentSource.name}`}
					className={actionClasses}
				>
					<ArchiveRestore className="size-4" aria-hidden="true" />
				</button>
			) : (
				<>
					<button
						type="button"
						onClick={() => setRenaming(true)}
						aria-label={`Renombrar ${paymentSource.name}`}
						className={actionClasses}
					>
						<Pencil className="size-4" aria-hidden="true" />
					</button>

					<ConfirmDialog
						title={`¿Archivar ${paymentSource.name}?`}
						description="Desaparece del selector al registrar un gasto, pero su histórico se conserva y puedes recuperarla desde aquí."
						confirmLabel="Archivar"
						onConfirm={() => archive.mutate(paymentSource.id)}
						trigger={
							<button
								type="button"
								disabled={archive.isPending}
								aria-label={`Archivar ${paymentSource.name}`}
								className={actionClasses}
							>
								<Archive className="size-4" aria-hidden="true" />
							</button>
						}
					/>
				</>
			)}
		</li>
	);
};
