import { spaceRoles } from '@walti/shared';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowLeft, CalendarRange, Plus, Receipt } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { categoriesQuery } from '@/features/categories/categoriesApi';
import {
	eventExpenseCandidatesQuery,
	eventExpensesQuery,
} from '@/features/events/eventExpensesApi';
import { eventsQuery } from '@/features/events/eventsApi';
import {
	useAssignExpensesToEvent,
	useUnassignExpensesFromEvent,
} from '@/features/events/hooks/useEventExpenseMutations';
import { paymentSourcesQuery } from '@/features/paymentSources/paymentSourcesApi';
import { formatCivilDate } from '@/lib/format/date';
import { formatMoney } from '@/lib/format/money';
import { ArchivedBadge } from '@/shared/components/archivedBadge';
import { EmptyState } from '@/shared/components/emptyState';
import { paths } from '@/shared/routes';
import type { Space } from '@/shared/spaces/spacesApi';
import type { Event, Expense } from '@walti/shared';

type EventScreenContentProps = { space: Space; eventId: string };

export const EventScreenContent = ({
	space,
	eventId,
}: EventScreenContentProps) => {
	const { data: events } = useSuspenseQuery(eventsQuery(space.id));
	const event = events.find((candidate) => candidate.id === eventId);

	if (!event) {
		return (
			<EmptyState
				icon={CalendarRange}
				title="Evento no encontrado"
				description="Puede que ya no exista o que el enlace esté mal escrito."
				action={
					<Button variant="outline" render={<Link to={paths.events} />}>
						Volver a eventos
					</Button>
				}
			/>
		);
	}

	return <EventDetail space={space} event={event} />;
};

const toggle = (set: Set<string>, id: string) => {
	const next = new Set(set);

	if (next.has(id)) {
		next.delete(id);
	} else {
		next.add(id);
	}

	return next;
};

const ExpenseListRow = ({
	expense,
	title,
	subtitle,
	currency,
	selected,
}: {
	expense: Expense;
	title: string;
	subtitle: string | null;
	currency: Space['currency'];
	selected?: { checked: boolean; onToggle: () => void };
}) => (
	<li className="flex items-center gap-3 rounded-xl border border-border p-3">
		{selected ? (
			<Checkbox
				checked={selected.checked}
				onCheckedChange={() => selected.onToggle()}
				aria-label={`Seleccionar gasto de ${title}`}
			/>
		) : null}

		<span className="flex min-w-0 flex-1 flex-col">
			<span className="truncate text-sm font-medium">{title}</span>
			<span className="truncate text-xs text-muted-foreground">
				{formatCivilDate(expense.occurredOn)}
				{subtitle ? ` · ${subtitle}` : ''}
			</span>
		</span>

		<span className="shrink-0 text-sm font-semibold tabular-nums">
			{formatMoney(expense.amountCents, currency)}
		</span>
	</li>
);

const EventDetail = ({ space, event }: { space: Space; event: Event }) => {
	const { data: groups } = useSuspenseQuery(categoriesQuery(space.id));
	const { data: paymentSources } = useSuspenseQuery(paymentSourcesQuery);
	const { data: linked } = useSuspenseQuery(
		eventExpensesQuery(space.id, event.id),
	);
	const { data: candidates } = useSuspenseQuery(
		eventExpenseCandidatesQuery(space.id, event.id),
	);

	const [addingOpen, setAddingOpen] = useState(false);
	const [selectedToRemove, setSelectedToRemove] = useState<Set<string>>(
		new Set(),
	);
	const [selectedToAdd, setSelectedToAdd] = useState<Set<string>>(new Set());

	const unassign = useUnassignExpensesFromEvent(space.id, event.id);
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

	const describe = (expense: Expense) => ({
		title: categoryNames.get(expense.categoryId) ?? 'Categoría',
		subtitle:
			expense.merchant ??
			(expense.paymentSourceId
				? (paymentSourceNames.get(expense.paymentSourceId) ?? null)
				: null),
	});

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
						{event.budgetCents !== null
							? ` · Presupuesto ${formatMoney(event.budgetCents, space.currency)}`
							: ''}
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
					<div className="flex items-center justify-between gap-2">
						<h3 className="text-sm font-medium text-muted-foreground">
							Gastos del evento
						</h3>

						{canManage && selectedToRemove.size > 0 ? (
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={unassign.isPending}
								onClick={() =>
									unassign.mutate(Array.from(selectedToRemove), {
										onSuccess: () => setSelectedToRemove(new Set()),
									})
								}
							>
								Quitar ({selectedToRemove.size})
							</Button>
						) : null}
					</div>

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
									selected={
										canManage
											? {
													checked: selectedToRemove.has(expense.id),
													onToggle: () =>
														setSelectedToRemove((current) =>
															toggle(current, expense.id),
														),
												}
											: undefined
									}
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
