import type { CategoryGroupList } from '@walti/shared';
import {
	Combobox,
	ComboboxCollection,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxLabel,
	ComboboxList,
} from '@/components/ui/combobox';

type CategoryOption = { value: string; label: string };
type CategoryGroupOption = { id: string; name: string; items: CategoryOption[] };

const buildGroupedCategories = (
	groups: CategoryGroupList | undefined,
): CategoryGroupOption[] =>
	(groups ?? [])
		.filter((group) => !group.archivedAt)
		.map((group) => ({
			id: group.id,
			name: group.name,
			items: group.categories
				.filter((category) => !category.archivedAt)
				.map((category) => ({ value: category.id, label: category.name })),
		}))
		.filter((group) => group.items.length > 0);

type CategoryComboboxProps = {
	groups: CategoryGroupList | undefined;
	value: string | null;
	onChange: (categoryId: string | null) => void;
};

export const CategoryCombobox = ({
	groups,
	value,
	onChange,
}: CategoryComboboxProps) => {
	const groupedItems = buildGroupedCategories(groups);
	const selected =
		groupedItems
			.flatMap((group) => group.items)
			.find((item) => item.value === value) ?? null;

	return (
		<Combobox
			items={groupedItems}
			value={selected}
			onValueChange={(item) => onChange(item ? item.value : null)}
		>
			<ComboboxInput placeholder="Buscar categoría…" className="h-11" />

			<ComboboxContent>
				<ComboboxEmpty>No se encontraron categorías.</ComboboxEmpty>

				<ComboboxList>
					{(group: CategoryGroupOption) => (
						<ComboboxGroup key={group.id} items={group.items}>
							<ComboboxLabel>{group.name}</ComboboxLabel>
							<ComboboxCollection>
								{(item: CategoryOption) => (
									<ComboboxItem key={item.value} value={item}>
										{item.label}
									</ComboboxItem>
								)}
							</ComboboxCollection>
						</ComboboxGroup>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
};
