import { Monitor, Moon, Sun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import type { ThemePreference } from '@/shared/theme/theme';
import { readThemePreference, setThemePreference } from '@/shared/theme/theme';

const options: { value: ThemePreference; label: string; icon: LucideIcon }[] = [
	{ value: 'light', label: 'Claro', icon: Sun },
	{ value: 'dark', label: 'Oscuro', icon: Moon },
	{ value: 'system', label: 'Sistema', icon: Monitor },
];

const optionClasses = [
	'flex min-h-10 items-center justify-center gap-2 rounded-md text-sm transition-colors',
	'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring',
].join(' ');

export const ThemeSelector = () => {
	const [preference, setPreference] =
		useState<ThemePreference>(readThemePreference);

	const choose = (value: ThemePreference) => {
		setThemePreference(value);
		setPreference(value);
	};

	return (
		<fieldset className="flex gap-1 rounded-lg bg-muted p-1">
			<legend className="sr-only">Tema de la aplicación</legend>

			{options.map((option) => {
				const Icon = option.icon;
				const isActive = option.value === preference;

				return (
					<label key={option.value} className="flex-1 cursor-pointer">
						<input
							type="radio"
							name="theme"
							value={option.value}
							checked={isActive}
							onChange={() => choose(option.value)}
							className="peer sr-only"
						/>

						<span
							className={`${optionClasses} ${
								isActive
									? 'bg-background font-medium shadow-sm'
									: 'text-muted-foreground'
							}`}
						>
							<Icon className="size-4" aria-hidden="true" />
							{option.label}
						</span>
					</label>
				);
			})}
		</fieldset>
	);
};
