import { useSuspenseQuery } from '@tanstack/react-query';
import { FieldDescription } from '@/components/ui/field';
import { paymentSourcesQuery } from '@/features/paymentSources/paymentSourcesApi';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

type PaymentSourceFieldProps = {
	value: string | null;
	onChange: (paymentSourceId: string | null) => void;
};

export const PaymentSourceField = ({
	value,
	onChange,
}: PaymentSourceFieldProps) => {
	const { data: sources } = useSuspenseQuery(paymentSourcesQuery);
	const active = sources.filter((source) => !source.archivedAt);

	if (active.length === 0) {
		return (
			<FieldDescription>
				Todavía no tienes fuentes de pago. Añádelas en Cuenta para poder
				elegirlas aquí.
			</FieldDescription>
		);
	}

	// Same exclusion as the category picker (categoryCombobox.tsx): an
	// archived source shouldn't be a choice for a *new* selection. This was
	// previously computing `active` only for the empty-state check above and
	// then rendering the unfiltered `sources` here, so an archived source
	// still showed up as a normal, selectable option.
	const items = Object.fromEntries(
		active.map((source) => [source.id, source.name]),
	);

	return (
		<Select items={items} value={value} onValueChange={onChange}>
			<SelectTrigger className="h-11 w-full">
				<SelectValue placeholder="Ninguna" />
			</SelectTrigger>

			<SelectContent>
				<SelectItem value={null}>Ninguna</SelectItem>

				{active.map((source) => (
					<SelectItem key={source.id} value={source.id}>
						{source.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
