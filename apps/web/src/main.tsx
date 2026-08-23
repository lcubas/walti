import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import './index.css';
import { Providers } from '@/app/providers';
import { router } from '@/app/router';
import { watchSystemTheme } from '@/shared/theme/theme';

const root = document.getElementById('root');

if (!root) {
	throw new Error('Root element not found');
}

watchSystemTheme();

createRoot(root).render(
	<StrictMode>
		<Providers>
			<RouterProvider router={router} />
		</Providers>
	</StrictMode>,
);
