import type { Expense } from '@walti/shared';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCivilDate } from '@/lib/format/date';
import { formatMoney } from '@/lib/format/money';
import type { Space } from '@/shared/spaces/spacesApi';

export const ExpenseListRow = ({
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
	selected: { checked: boolean; onToggle: () => void };
}) => (
	<li className="flex items-center gap-3 rounded-xl border border-border p-3">
		<Checkbox
			checked={selected.checked}
			onCheckedChange={() => selected.onToggle()}
			aria-label={`Seleccionar gasto de ${title}`}
		/>

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
