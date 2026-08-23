import { CircleUser, CreditCard, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { ServiceStatus } from '../../features/health/serviceStatus';
import { paths } from '../../shared/routes';
import { MenuRow, MenuDrawer, menuRowClasses } from './menuDrawer';

const account = { name: 'Tu nombre', email: 'tu@correo.com' };

export const AccountMenu = () => {
	const [open, setOpen] = useState(false);
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
			<div className="flex items-center gap-3 px-2 pb-3">
				<CircleUser
					className="size-9 text-muted-foreground"
					aria-hidden="true"
				/>

				<span className="flex flex-col">
					<span className="text-sm font-medium">{account.name}</span>
					<span className="text-xs text-muted-foreground">{account.email}</span>
				</span>
			</div>

			<Link to={paths.cuenta} onClick={close} className={menuRowClasses}>
				<MenuRow
					icon={<CircleUser className="size-4" aria-hidden="true" />}
					label="Perfil"
				/>
			</Link>

			<Link to={paths.cuenta} onClick={close} className={menuRowClasses}>
				<MenuRow
					icon={<CreditCard className="size-4" aria-hidden="true" />}
					label="Fuentes de pago"
					description="Tarjetas y efectivo"
				/>
			</Link>

			<button type="button" onClick={close} className={menuRowClasses}>
				<MenuRow
					icon={<LogOut className="size-4" aria-hidden="true" />}
					label="Cerrar sesión"
					description="Disponible en E2"
				/>
			</button>

			<div className="border-t border-border px-2 pt-3">
				<ServiceStatus />
			</div>
		</MenuDrawer>
	);
};
