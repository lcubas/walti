type ArchivedBadgeProps = {
	label?: string;
};

export const ArchivedBadge = ({ label = 'Archivado' }: ArchivedBadgeProps) => (
	<span className="inline-flex w-fit items-center rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
		{label}
	</span>
);
