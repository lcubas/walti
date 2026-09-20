import { cn } from '@/lib/utils';
import type { Space } from '@/shared/spaces/spacesApi';
import { spaceTones } from '@/shared/spaces/spaceTones';

export const SpaceAvatar = ({
	space,
	className,
}: {
	space: Space;
	className?: string;
}) => (
	<span
		aria-hidden="true"
		className={cn(
			'flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold',
			spaceTones[space.tone].solid,
			space.archivedAt && 'opacity-50',
			className,
		)}
	>
		{[...space.name.trim()][0]?.toLocaleUpperCase() ?? '·'}
	</span>
);
