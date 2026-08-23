import { Outlet } from 'react-router';
import { AppHeader } from './appHeader';
import { BottomNav } from './bottomNav';

export const AppLayout = () => (
	<div className="min-h-dvh bg-background text-foreground">
		<AppHeader />

		<main className="mx-auto max-w-screen-sm px-4 pt-6 pb-28">
			<Outlet />
		</main>

		<BottomNav />
	</div>
);
