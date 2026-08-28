import { useEffect, useRef, useState } from 'react';
import { env } from '@/config/env';

const scriptSrc = 'https://accounts.google.com/gsi/client';

const loadScript = () =>
	new Promise<void>((resolve, reject) => {
		if (window.google) {
			resolve();
			return;
		}

		const existing = document.querySelector<HTMLScriptElement>(
			`script[src="${scriptSrc}"]`,
		);
		const script = existing ?? document.createElement('script');

		script.addEventListener('load', () => resolve());
		script.addEventListener('error', () =>
			reject(new Error('google script failed')),
		);

		if (!existing) {
			script.src = scriptSrc;
			script.async = true;
			document.head.appendChild(script);
		}
	});

/**
 * Renders Google's own button: a custom button is not allowed
 * to trigger the credential flow.
 */
export const useGoogleButton = (onCredential: (idToken: string) => void) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const handlerRef = useRef(onCredential);
	const [scriptFailed, setScriptFailed] = useState(false);

	handlerRef.current = onCredential;

	useEffect(() => {
		let cancelled = false;

		loadScript()
			.then(() => {
				if (cancelled || !window.google || !containerRef.current) {
					return;
				}

				window.google.accounts.id.initialize({
					client_id: env.VITE_GOOGLE_CLIENT_ID,
					callback: (response) => handlerRef.current(response.credential),
				});

				window.google.accounts.id.renderButton(containerRef.current, {
					theme: 'outline',
					size: 'large',
					text: 'continue_with',
					shape: 'pill',
					width: 280,
					locale: 'es',
				});
			})
			.catch(() => {
				if (!cancelled) {
					setScriptFailed(true);
				}
			});

		return () => {
			cancelled = true;
		};
	}, []);

	return { containerRef, scriptFailed };
};
