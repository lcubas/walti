import { CircleUser, CreditCard, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { ServiceStatus } from '@/features/health/serviceStatus';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { paths } from '@/shared/routes';
import { useSession } from '@/features/auth/hooks/useSession';
import { MenuRow, MenuDrawer, menuRowClasses } from '@/app/layout/menuDrawer';

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
			triggerClassName="rounded-full p-1 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
			trigger={<CircleUser className="size-6" aria-hidden="true" />}
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
					label="Perfil"
				/>
			</Link>

			<Link to={paths.account} onClick={close} className={menuRowClasses}>
				<MenuRow
					icon={<CreditCard className="size-4" aria-hidden="true" />}
					label="Fuentes de pago"
					description="Tarjetas y efectivo"
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

			<div className="border-t border-border px-2 pt-3">
				<ServiceStatus />
			</div>
		</MenuDrawer>
	);
};
