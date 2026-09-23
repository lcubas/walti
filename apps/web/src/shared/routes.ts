export const paths = {
	home: '/',
	expenses: '/gastos',
	expense: '/gastos/:expenseId',
	events: '/eventos',
	event: '/eventos/:eventId',
	plan: '/plan',
	recurring: '/plan/recurrentes',
	analysis: '/analisis',
	myAnalysis: '/analisis/mios',
	space: '/espacio',
	categories: '/categorias',
	spaces: '/espacios',
	account: '/cuenta',
	signIn: '/entrar',
} as const;

/**
 * The space a shared link was made in. It is a door and not a carrier: the app
 * reads it once on arrival and then takes it out of the URL, so no screen has
 * to remember to drag it along.
 */
export const activeSpaceParam = 'espacio';
