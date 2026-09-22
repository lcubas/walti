import { Users } from 'lucide-react';
import { SpaceAvatar } from '@/features/spaces/components/spaceAvatar';
import type { Space } from '@/shared/spaces/spacesApi';
import { isShared } from '@/shared/spaces/spacesContext';

export const SpacePill = ({ space }: { space: Space }) => (
	<span className="flex min-h-9 max-w-full shrink items-center gap-2 rounded-full bg-muted py-1 pr-3 pl-1 text-sm font-medium">
		<SpaceAvatar space={space} className="size-7 rounded-full" />

		<span className="truncate">{space.name}</span>

		{isShared(space) ? (
			<span className="flex items-center gap-1 rounded-full bg-background px-1.5 py-0.5 text-xs text-muted-foreground">
				<Users className="size-3" aria-hidden="true" />
				{space.members}
			</span>
		) : null}
	</span>
);
