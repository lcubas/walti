import { cn } from '@/lib/utils';
import type { Space } from '@/shared/spaces/spacesApi';
import { spaceTones } from '@/shared/spaces/spaceTones';

/**
 * A space's face: its initial on its own tone, filled. The rule about solid
 * fill meaning action is about controls; this is a mark, it has no hover and it
 * is not pressable. Filled because a tinted chip at low opacity reads as grey
 * in light mode, which is the same as saying nothing.
 *
 * Never the only signal: the name sits right next to it (WCAG 1.4.1).
 */
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
