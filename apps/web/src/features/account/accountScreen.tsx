import { ServiceSection } from '@/features/health/serviceSection';
import { ThemeSelector } from '@/features/account/themeSelector';
import { PaymentSourcesSection } from '@/features/paymentSources/paymentSourcesSection';
import { LoadingState } from '@/shared/components/loadingState';
import { QuerySuspense } from '@/shared/components/querySuspense';

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
			<h2 className="text-sm font-medium">Fuentes de pago</h2>
			<p className="mt-1 text-xs text-muted-foreground">
				Tarjetas, cuentas o efectivo.
			</p>

			<div className="mt-3">
				<QuerySuspense
					loading={
						<LoadingState rows={2} label="Cargando tus fuentes de pago" />
					}
				>
					<PaymentSourcesSection />
				</QuerySuspense>
			</div>
		</div>

		<div className="mt-8 border-t border-border pt-6">
			<h2 className="text-sm font-medium">Servicio</h2>

			<div className="mt-3">
				<QuerySuspense
					loading={<LoadingState rows={1} label="Comprobando el servicio" />}
				>
					<ServiceSection />
				</QuerySuspense>
			</div>
		</div>
	</section>
);
