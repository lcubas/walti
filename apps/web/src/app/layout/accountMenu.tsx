import { CircleUser, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { paths } from '@/shared/routes';
import { useSession } from '@/features/auth/hooks/useSession';
import { MenuDrawer } from '@/app/layout/menuDrawer';
import { MenuRow, menuRowClasses } from '@/shared/components/menuRow';
import { cn } from '@/lib/utils';

const triggerBaseClasses =
	'flex size-8 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export const AccountMenu = () => {
	const [open, setOpen] = useState(false);
	const { data: user } = useSession();
	const signOut = useSignOut();
	const close = () => setOpen(false);

	return (
		<MenuDrawer
			label="Tu cuenta"
			title="Tu cuenta"
			open={open}
			onOpenChange={setOpen}
			triggerClassName={cn(
				triggerBaseClasses,
				user?.avatarUrl
					? 'overflow-hidden ring-2 ring-white/60 hover:ring-white/85'
					: 'bg-white/15 text-white hover:bg-white/25',
			)}
			trigger={
				user?.avatarUrl ? (
					<img
						src={user.avatarUrl}
						alt=""
						referrerPolicy="no-referrer"
						className="size-full object-cover"
					/>
				) : (
					<CircleUser className="size-5" aria-hidden="true" />
				)
			}
		>
			{user ? (
				<div className="flex items-center gap-3 px-2 pb-3">
					{user.avatarUrl ? (
						<img
							src={user.avatarUrl}
							alt=""
							referrerPolicy="no-referrer"
							className="size-9 rounded-full object-cover"
						/>
					) : (
						<CircleUser
							className="size-9 text-muted-foreground"
							aria-hidden="true"
						/>
					)}

					<span className="flex flex-col">
						<span className="text-sm font-medium">{user.name}</span>
						<span className="text-xs text-muted-foreground">{user.email}</span>
					</span>
				</div>
			) : null}

			<Link to={paths.account} onClick={close} className={menuRowClasses}>
				<MenuRow
					icon={<CircleUser className="size-4" aria-hidden="true" />}
					label="Cuenta"
					description="Apariencia y fuentes de pago"
				/>
			</Link>

			{user ? (
				<button
					type="button"
					disabled={signOut.isPending}
					onClick={() => signOut.mutate()}
					className={`${menuRowClasses} disabled:pointer-events-none disabled:opacity-50`}
				>
					<MenuRow
						icon={<LogOut className="size-4" aria-hidden="true" />}
						label="Cerrar sesión"
						description={signOut.isPending ? 'Cerrando…' : undefined}
					/>
				</button>
			) : (
				<Link to={paths.signIn} onClick={close} className={menuRowClasses}>
					<MenuRow
						icon={<LogIn className="size-4" aria-hidden="true" />}
						label="Entrar"
						description="Aún no has iniciado sesión"
					/>
				</Link>
			)}
		</MenuDrawer>
	);
};
