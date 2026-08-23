type PendingScreenProps = { title: string };

export const PendingScreen = ({ title }: PendingScreenProps) => (
	<section>
		<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
		<p className="mt-2 text-sm text-muted-foreground">En construcción</p>
	</section>
);
