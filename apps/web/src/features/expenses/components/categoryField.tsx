import { useSuspenseQuery } from '@tanstack/react-query';
import { FieldDescription } from '@/components/ui/field';
import { categoriesQuery } from '@/features/categories/categoriesApi';
import { CategoryCombobox } from '@/features/expenses/components/categoryCombobox';

type CategoryFieldProps = {
	spaceId: string;
	value: string | null;
	onChange: (categoryId: string | null) => void;
};

export const CategoryField = ({
	spaceId,
	value,
	onChange,
}: CategoryFieldProps) => {
	const { data: groups } = useSuspenseQuery(categoriesQuery(spaceId));
	const hasCategories = groups.some(
		(group) => !group.archivedAt && group.categories.some((c) => !c.archivedAt),
	);

	if (!hasCategories) {
		return (
			<FieldDescription>
				Este espacio todavía no tiene categorías activas. Créalas en Categorías
				antes de registrar un gasto.
			</FieldDescription>
		);
	}

	return <CategoryCombobox groups={groups} value={value} onChange={onChange} />;
};
