import { type FormEvent, useId, useState } from 'react';
import * as v from 'valibot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/** Both contracts carry the same single field; the caller passes its own. */
type NameSchema = v.GenericSchema<unknown, { name: string }>;

type SpaceFormProps = {
	schema: NameSchema;
	label: string;
	submitLabel: string;
	initialName?: string;
	/** Names already in use by this user. Two spaces cannot share one. */
	takenNames?: string[];
	pending: boolean;
	onSubmit: (name: string) => void;
	onCancel?: () => void;
};

/**
 * The single field that creating and renaming a space share. It validates with
 * the same contract the API uses, so the message the user reads on submit is
 * the one the server would have sent back.
 */
export const SpaceForm = ({
	schema,
	label,
	submitLabel,
	initialName = '',
	takenNames = [],
	pending,
	onSubmit,
	onCancel,
}: SpaceFormProps) => {
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

	const submit = (event: FormEvent) => {
		event.preventDefault();

		const result = v.safeParse(schema, { name });

		if (!result.success) {
			setError(result.issues[0].message);
			return;
		}

		if (isDuplicate) {
			setError('Ya tienes un espacio con ese nombre.');
			return;
		}

		setError(null);
		onSubmit(result.output.name);
	};

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
					placeholder="Hogar"
					maxLength={50}
					autoComplete="off"
					aria-invalid={error || isDuplicate ? true : undefined}
					aria-describedby={error || isDuplicate ? errorId : undefined}
				/>

				{error ? (
					<p id={errorId} role="alert" className="text-sm text-destructive">
						{error}
					</p>
				) : null}

				{/* Said before submitting, not after: the API refuses it too, but
				    the user should not have to press to find out. */}
				{!error && isDuplicate ? (
					<p id={errorId} role="alert" className="text-sm text-destructive">
						Ya tienes un espacio con ese nombre.
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
