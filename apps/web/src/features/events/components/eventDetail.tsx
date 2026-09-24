import { spaceRoles } from '@walti/shared';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowLeft, Plus, Receipt } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { categoriesQuery } from '@/features/categories/categoriesApi';
import { ExpenseListRow } from '@/features/events/components/expenseListRow';
import {
	eventExpenseCandidatesQuery,
	eventExpensesQuery,
} from '@/features/events/eventExpensesApi';
import { useAssignExpensesToEvent } from '@/features/events/hooks/useEventExpenseMutations';
import { paymentSourcesQuery } from '@/features/paymentSources/paymentSourcesApi';
import { formatCivilDate } from '@/lib/format/date';
import { formatMoney } from '@/lib/format/money';
import { ArchivedBadge } from '@/shared/components/archivedBadge';
import { EmptyState } from '@/shared/components/emptyState';
import { paths } from '@/shared/routes';
import type { Space } from '@/shared/spaces/spacesApi';
import type { Event, Expense } from '@walti/shared';

const toggle = (set: Set<string>, id: string) => {
	const next = new Set(set);

	if (next.has(id)) {
		next.delete(id);
	} else {
		next.add(id);
	}

	return next;
};

export const EventDetail = ({
	space,
	event,
}: {
	space: Space;
	event: Event;
}) => {
	const { data: groups } = useSuspenseQuery(categoriesQuery(space.id));
	const { data: paymentSources } = useSuspenseQuery(paymentSourcesQuery);
	const { data: linked } = useSuspenseQuery(
		eventExpensesQuery(space.id, event.id),
	);
	const { data: candidates } = useSuspenseQuery(
		eventExpenseCandidatesQuery(space.id, event.id),
	);

	const [addingOpen, setAddingOpen] = useState(false);
	const [selectedToAdd, setSelectedToAdd] = useState<Set<string>>(new Set());
	const [expandedExpenseId, setExpandedExpenseId] = useState<string | null>(
		null,
	);

	const assign = useAssignExpensesToEvent(space.id, event.id);

	const canManage = space.role === spaceRoles.owner;

	// Categories and payment sources are archived, never deleted, so a
	// linked expense's ids always resolve here even if either has since
	// been archived.
	const categoryNames = new Map(
		groups.flatMap((group) =>
			group.categories.map((category) => [category.id, category.name] as const),
		),
	);
	const paymentSourceNames = new Map(
		paymentSources.map((source) => [source.id, source.name] as const),
	);

	const describe = (expense: Expense) => {
		const paymentSourceName = expense.paymentSourceId
			? (paymentSourceNames.get(expense.paymentSourceId) ?? null)
			: null;

		return {
			title: categoryNames.get(expense.categoryId) ?? 'Categoría',
			subtitle: expense.merchant ?? paymentSourceName,
			paymentSourceName,
		};
	};

	const total = linked.reduce((sum, expense) => sum + expense.amountCents, 0);

	return (
		<section className="space-y-6 py-2">
			<div className="space-y-3">
				<Link
					to={paths.events}
					className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="size-4" aria-hidden="true" />
					Eventos
				</Link>

				<header className="space-y-1">
					<div className="flex items-center gap-2">
						<h1 className="text-lg font-semibold">{event.name}</h1>
						{event.archivedAt ? <ArchivedBadge /> : null}
					</div>

					<p className="text-sm text-muted-foreground">
						{formatCivilDate(event.startsOn)} – {formatCivilDate(event.endsOn)}
					</p>
				</header>

				<p className="text-3xl font-semibold">
					{formatMoney(total, space.currency)}
				</p>
			</div>

			{linked.length === 0 ? (
				<EmptyState
					icon={Receipt}
					title="Sin gastos en este evento"
					description="Los que registres con esta fecha se asocian solos; los que ya existían puedes añadirlos abajo."
				/>
			) : (
				<div className="space-y-2">
					<h3 className="text-sm font-medium text-muted-foreground">
						Gastos del evento
					</h3>

					<ul className="space-y-2">
						{linked.map((expense) => {
							const info = describe(expense);

							return (
								<ExpenseListRow
									key={expense.id}
									expense={expense}
									title={info.title}
									subtitle={info.subtitle}
									currency={space.currency}
									detail={{
										expanded: expandedExpenseId === expense.id,
										onToggle: () =>
											setExpandedExpenseId((current) =>
												current === expense.id ? null : expense.id,
											),
										paymentSourceName: info.paymentSourceName,
									}}
								/>
							);
						})}
					</ul>
				</div>
			)}

			{canManage && !event.archivedAt ? (
				<Collapsible open={addingOpen} onOpenChange={setAddingOpen}>
					<CollapsibleTrigger
						render={
							<Button
								type="button"
								variant="ghost"
								className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
							/>
						}
					>
						<Plus className="size-4" aria-hidden="true" />
						Añadir gastos olvidados
					</CollapsibleTrigger>

					<CollapsibleContent className="overflow-hidden">
						<div className="space-y-3 pt-3">
							{candidates.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									No hay gastos sueltos en las fechas de este evento.
								</p>
							) : (
								<>
									<p className="text-sm text-muted-foreground">
										Gastos sin evento asignado en estas fechas.
									</p>

									<ul className="space-y-2">
										{candidates.map((expense) => {
											const info = describe(expense);

											return (
												<ExpenseListRow
													key={expense.id}
													expense={expense}
													title={info.title}
													subtitle={info.subtitle}
													currency={space.currency}
													selected={{
														checked: selectedToAdd.has(expense.id),
														onToggle: () =>
															setSelectedToAdd((current) =>
																toggle(current, expense.id),
															),
													}}
												/>
											);
										})}
									</ul>

									<Button
										type="button"
										disabled={selectedToAdd.size === 0 || assign.isPending}
										onClick={() =>
											assign.mutate(Array.from(selectedToAdd), {
												onSuccess: () => setSelectedToAdd(new Set()),
											})
										}
									>
										Añadir seleccionados ({selectedToAdd.size})
									</Button>
								</>
							)}
						</div>
					</CollapsibleContent>
				</Collapsible>
			) : null}
		</section>
	);
};
