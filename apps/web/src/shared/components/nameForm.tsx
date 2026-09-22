import { type SubmitEvent, useId, useState } from 'react';
import * as v from 'valibot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type NameSchema = v.GenericSchema<unknown, { name: string }>;

type NameFormProps = {
	schema: NameSchema;
	label: string;
	submitLabel: string;
	placeholder?: string;
	initialName?: string;
	maxLength?: number;
	/** Names already in use among its siblings. */
	takenNames?: string[];
	duplicateMessage?: string;
	pending: boolean;
	onSubmit: (name: string) => void;
	onCancel?: () => void;
};

/**
 * The single field that creating and renaming share. It validates with the same
 * contract the API uses, so the message read on submit is the one the server
 * would have sent back.
 */
export const NameForm = ({
	schema,
	label,
	submitLabel,
	placeholder,
	initialName = '',
	maxLength = 50,
	takenNames = [],
	duplicateMessage = 'Ya existe uno con ese nombre.',
	pending,
	onSubmit,
	onCancel,
}: NameFormProps) => {
	const fieldId = useId();
	const errorId = useId();
	const [name, setName] = useState(initialName);
	const [error, setError] = useState<string | null>(null);

	const trimmed = name.trim();
	const isDuplicate =
		trimmed.length > 0 &&
		trimmed.toLocaleLowerCase() !== initialName.trim().toLocaleLowerCase() &&
		takenNames.some(
			(taken) => taken.toLocaleLowerCase() === trimmed.toLocaleLowerCase(),
		);

	const submit = (event: SubmitEvent) => {
		event.preventDefault();

		const result = v.safeParse(schema, { name });

		if (!result.success) {
			setError(result.issues[0].message);
			return;
		}

		if (isDuplicate) {
			setError(duplicateMessage);
			return;
		}

		setError(null);
		onSubmit(result.output.name);
	};

	const message = error ?? (isDuplicate ? duplicateMessage : null);

	return (
		<form onSubmit={submit} className="space-y-3" noValidate>
			<div className="space-y-1.5">
				<label htmlFor={fieldId} className="text-sm font-medium">
					{label}
				</label>

				<Input
					id={fieldId}
					value={name}
					onChange={(event) => setName(event.target.value)}
					placeholder={placeholder}
					maxLength={maxLength}
					autoComplete="off"
					aria-invalid={message ? true : undefined}
					aria-describedby={message ? errorId : undefined}
				/>

				{/* Said before submitting, not after: the API refuses it too, but the
				    user should not have to press to find out. */}
				{message ? (
					<p id={errorId} role="alert" className="text-sm text-destructive">
						{message}
					</p>
				) : null}
			</div>

			<div className="flex gap-2">
				<Button
					type="submit"
					disabled={pending || trimmed.length === 0 || isDuplicate}
				>
					{pending ? 'Guardando…' : submitLabel}
				</Button>

				{onCancel ? (
					<Button type="button" variant="ghost" onClick={onCancel}>
						Cancelar
					</Button>
				) : null}
			</div>
		</form>
	);
};
