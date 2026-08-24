type GoogleCredentialResponse = { credential: string };

type GoogleIdentityApi = {
	accounts: {
		id: {
			initialize: (config: {
				client_id: string;
				callback: (response: GoogleCredentialResponse) => void;
				auto_select?: boolean;
				cancel_on_tap_outside?: boolean;
			}) => void;
			renderButton: (
				parent: HTMLElement,
				options: {
					type?: 'standard' | 'icon';
					theme?: 'outline' | 'filled_blue' | 'filled_black';
					size?: 'small' | 'medium' | 'large';
					text?: 'signin_with' | 'signup_with' | 'continue_with';
					shape?: 'rectangular' | 'pill';
					width?: number;
					locale?: string;
				},
			) => void;
		};
	};
};

declare global {
	interface Window {
		google?: GoogleIdentityApi;
	}
}

export {};
