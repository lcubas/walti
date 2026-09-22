import { createContext, type ReactNode, useContext, useState } from 'react';

type NewExpenseDrawerValue = {
	open: boolean;
	openDrawer: () => void;
	closeDrawer: () => void;
};

const NewExpenseDrawerContext = createContext<NewExpenseDrawerValue | null>(
	null,
);

export const NewExpenseDrawerProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [open, setOpen] = useState(false);

	return (
		<NewExpenseDrawerContext.Provider
			value={{
				open,
				openDrawer: () => setOpen(true),
				closeDrawer: () => setOpen(false),
			}}
		>
			{children}
		</NewExpenseDrawerContext.Provider>
	);
};

export const useNewExpenseDrawer = () => {
	const context = useContext(NewExpenseDrawerContext);

	if (!context) {
		throw new Error(
			'useNewExpenseDrawer must be used within a NewExpenseDrawerProvider.',
		);
	}

	return context;
};
