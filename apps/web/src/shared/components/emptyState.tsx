import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type EmptyStateProps = {
	icon: LucideIcon;
	title: string;
	description: string;
	action?: ReactNode;
};

export const EmptyState = ({
	icon: Icon,
	title,
	description,
	action,
}: EmptyStateProps) => (
	<div className="flex flex-col items-center px-6 py-12 text-center">
		<span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
			<Icon className="size-6" aria-hidden="true" />
		</span>

		<h2 className="mt-4 text-base font-medium">{title}</h2>
		<p className="mt-1 max-w-xs text-sm text-balance text-muted-foreground">
			{description}
		</p>

		{action ? <div className="mt-5">{action}</div> : null}
	</div>
);
