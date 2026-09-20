/**
 * Default category structure used when creating a new space.
 *
 * Each space gets its own copy, which can then be modified independently.
 */
export const categoryTemplate = [
	{
		name: 'Alimentación',
		categories: ['Mercado', 'Supermercado', 'Restaurantes', 'Delivery'],
	},
	{
		name: 'Hogar',
		categories: ['Alquiler o hipoteca', 'Mantenimiento y equipamiento'],
	},
	{
		name: 'Transporte',
		categories: ['Transporte público y taxis', 'Combustible'],
	},
	{
		name: 'Servicios',
		categories: ['Luz', 'Agua', 'Gas', 'Internet y telefonía'],
	},
	{
		name: 'Salud',
		categories: ['Consultas y exámenes', 'Medicinas', 'Seguro de salud'],
	},
	{
		name: 'Ocio',
		categories: ['Salidas y entretenimiento', 'Suscripciones', 'Viajes'],
	},
	{
		name: 'Personal',
		categories: ['Ropa y calzado', 'Cuidado personal', 'Educación', 'Gimnasio'],
	},
] as const;
