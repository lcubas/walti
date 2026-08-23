import { ThemeSelector } from '@/features/account/themeSelector';

export const AccountScreen = () => (
	<section>
		<h1 className="text-2xl font-semibold tracking-tight">Tu cuenta</h1>

		<div className="mt-6">
			<h2 className="text-sm font-medium">Apariencia</h2>
			<p className="mt-1 text-xs text-muted-foreground">
				Con <span className="font-medium">Sistema</span> la app sigue el tema de
				tu teléfono.
			</p>

			<div className="mt-3">
				<ThemeSelector />
			</div>
		</div>

		<div className="mt-8 border-t border-border pt-6">
			<p className="text-sm text-muted-foreground">
				Perfil y fuentes de pago, en construcción.
			</p>
		</div>
	</section>
);
