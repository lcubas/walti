import type { ReactElement } from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type ConfirmDialogProps = {
	trigger: ReactElement;
	title: string;
	description: string;
	confirmLabel: string;
	onConfirm: () => void;
};

/**
 * Confirmation for actions that cannot be undone. The label names the action
 * instead of saying "OK", so the button itself states what is about to happen.
 */
export const ConfirmDialog = ({
	trigger,
	title,
	description,
	confirmLabel,
	onConfirm,
}: ConfirmDialogProps) => (
	<AlertDialog>
		<AlertDialogTrigger render={trigger} />

		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>{title}</AlertDialogTitle>
				<AlertDialogDescription>{description}</AlertDialogDescription>
			</AlertDialogHeader>

			<AlertDialogFooter>
				<AlertDialogCancel>Cancelar</AlertDialogCancel>
				<AlertDialogAction onClick={onConfirm}>
					{confirmLabel}
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
);
