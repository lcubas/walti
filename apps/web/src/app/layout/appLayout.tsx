import { Outlet } from 'react-router';
import { AppHeader } from '@/app/layout/appHeader';
import { BottomNav } from '@/app/layout/bottomNav';
import { NewExpenseDrawer } from '@/features/expenses/newExpenseDrawer';
import { NewExpenseDrawerProvider } from '@/shared/expenses/newExpenseDrawerContext';

export const AppLayout = () => (
	<NewExpenseDrawerProvider>
		<div className="min-h-dvh bg-background text-foreground">
			<AppHeader />

			<main className="mx-auto max-w-screen-sm px-4 pt-6 pb-28">
				<Outlet />
			</main>

			<BottomNav />
			<NewExpenseDrawer />
		</div>
	</NewExpenseDrawerProvider>
);
