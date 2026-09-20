# Modelo de datos

17 tablas en SQLite (Turso), definidas con Drizzle en `apps/api/src/shared/database/schema/`.
El esquema es la fuente de verdad; este documento explica lo que el esquema no puede decir por sí solo.

## Convenciones

| Aspecto | Regla |
|---|---|
| Identificadores | `text` con UUIDv7 generado en la aplicación (`primaryId()`). Ordenables por tiempo de creación. |
| Timestamps | `created_at` y `updated_at`, `text` ISO-8601 UTC, obligatorios (`timestamps()`). |
| Dinero | Siempre enteros de centavos, en columnas `*_cents`. Nunca decimales. |
| Fechas civiles | `text` `YYYY-MM-DD`. Son el día que le pasó a la persona, no un instante. |
| Períodos mensuales | `text` `YYYY-MM`. |
| Archivado | `archived_at` nullable. Archivar nunca borra ni altera el histórico. |
| Nombres | Tablas y columnas en `snake_case` plural; en TypeScript, `camelCase`. |
| Integridad | Se prefiere una restricción real (FK, `unique`, `check`) sobre validar en la aplicación. |

SQLite no trae `REGEXP`, así que los formatos de fecha se fijan con `GLOB` (ver `predicates.ts`).

**Notación de este documento:** `columna → tabla` es una clave foránea; `columna?` es nullable.

## Usuarios

### `users`
La persona. `google_sub` · `email` · `name` · `avatar_url?`
- `google_sub` y `email` son únicos. No hay contraseñas.

### `user_settings`
Preferencias de la persona, una fila por usuario. `user_id` → users · `currency` · `planning_reminder_day` · `planning_reminder_enabled`
- **Es la única fuente de la moneda.** Un espacio copia la suya de aquí al crearse; no se elige por espacio.
- `planning_reminder_day` entre 1 y 31. Es preferencia de la persona y aplica a todos sus espacios.

## Espacios

### `spaces`
Frontera de privacidad, colaboración, planificación y análisis. `name` · `currency` · `is_default` · `archived_at?`
- `is_default` marca el espacio personal que nace con la cuenta. Un espacio por defecto no puede estar archivado.

### `space_members`
Quién pertenece a qué espacio y con qué rol. `space_id` → spaces · `user_id` → users · `role`
- `role` es `owner` o `member`. Único por `(space_id, user_id)`.
- **Esta tabla es el control de acceso.** Toda lectura de datos de un espacio se filtra por membresía.

### `payment_sources`
Con qué se pagó: Visa BCP, efectivo. `user_id` → users · `name` · `archived_at?`
- Pertenecen al usuario, no al espacio. No llevan saldo, deuda ni línea disponible.

## Categorías

Hay dos catálogos con la misma forma y dueños distintos, más un puente entre ellos.

- **Las categorías del espacio** son las que usa un gasto. Pertenecen al espacio para que un espacio compartido dé la misma respuesta a "gasto por categoría" mire quien mire.
- **Las categorías del usuario** son su vocabulario personal. Cada espacio nuevo se materializa a partir de él.
- **El mapeo** recuerda de qué idea personal salió cada copia, y es lo que permitirá comparar entre espacios.

### `space_category_groups`
Primer nivel. `space_id` → spaces · `name` · `sort_order` · `archived_at?`
- Índice único `(id, space_id)`: **no es un duplicado de la primary key.** Es lo que permite que una categoría apunte al par (grupo, espacio) y sea rechazada si los dos no concuerdan. No eliminarlo.

### `space_categories`
Segundo nivel, y lo que referencia un gasto. `space_id` → spaces · `group_id` · `name` · `sort_order` · `intent?` · `archived_at?`
- FK compuesta `(group_id, space_id)` → `space_category_groups (id, space_id)`. Una categoría no puede colgar de un grupo de otro espacio.
- `intent` es `protect`, `maintain` o `reduce`; nullable mientras la persona no opine. Lo consume el motor de recomendaciones.
- Máximo dos niveles. No hay categorías anidadas.

### `user_category_groups` y `user_categories`
Misma forma que las del espacio, con `user_id` en lugar de `space_id`, incluidos el índice único `(id, user_id)` y la FK compuesta.
- Se siembran una sola vez, al crear la cuenta, desde la plantilla de fábrica en `apps/api/src/config/categoryTemplate.ts`.

### `user_space_category_mappings`
Une una categoría de espacio con la categoría personal de la que salió. `user_id` → users · `space_category_id` → space_categories · `user_category_id` → user_categories
- Único por `(user_id, space_category_id)`. El espacio no está en la clave: la categoría de espacio ya lo determina, y repetirlo permitiría que los dos se contradijeran.

## Gastos

### `events`
Contextualiza gasto extraordinario. `space_id` → spaces · `name` · `starts_on` · `ends_on` · `budget_cents?` · `archived_at?`
- `ends_on >= starts_on`.

### `expenses`
`space_id` → spaces · `category_id` → space_categories · `amount_cents` · `occurred_on` · `event_id?` → events · `payment_source_id?` → payment_sources · `merchant?` · `note?` · `created_by_user_id` → users
- `amount_cents > 0`. `occurred_on` con formato `YYYY-MM-DD`.
- Un gasto tiene exactamente una categoría y como máximo un evento.
- `created_by_user_id` es **interno**: no se muestra en la interfaz. Sirve para ordenar el selector de categorías por uso reciente de esa persona.
- No hay cierre mensual: cualquier gasto histórico se puede editar o borrar.

## Recurrentes

### `recurring_items`
La configuración, no el gasto. `space_id` → spaces · `category_id` → space_categories · `name` · `kind` · `frequency` · `anchor_day` · `expected_amount_cents` · `paused_at?` · `archived_at?`
- `kind` es `automatic` (suscripciones, se cobran solas) o `manual` (servicios, hay que pagarlos).
- `frequency` es `monthly` o `yearly`. `anchor_day` entre 1 y 31.

### `recurring_periods`
Un pago esperado de un período. `recurring_item_id` → recurring_items · `period` · `due_on` · `expected_amount_cents` · `status` · `expense_id?` → expenses · `remind_at?` · `resolved_by_user_id?` → users · `resolved_at?`
- `status` es `pending`, `registered`, `postponed` o `skipped`.
- **Un período no es un gasto.** Solo `registered` corresponde a uno real, y un `check` obliga a que `expense_id` esté presente exactamente cuando el estado es `registered`.
- Único por `(recurring_item_id, period)`: hay un solo pendiente por período, y por eso las acciones se sincronizan entre los miembros del espacio.

## Planificación

### `monthly_plans`
`space_id` → spaces · `period` · `max_limit_cents?` · `accepted_at?`
- Único por `(space_id, period)`. El presupuesto existe solo para su mes; no hay rollover.
- `accepted_at` distingue una propuesta de un plan aceptado. Un plan aceptado no se recalcula solo.

### `monthly_plan_allocations`
Cuánto se asigna a qué. `monthly_plan_id` → monthly_plans · `group_id?` → space_category_groups · `category_id?` → space_categories · `amount_cents`
- `amount_cents > 0`.
- `check` de XOR: una asignación es de grupo **o** de categoría, nunca de las dos ni de ninguna. Se presupuesta sobre todo por grupos.
- Lo que no se asigna no se guarda: es la diferencia contra `max_limit_cents` y se muestra como margen.

## Notificaciones

### `notification_prefs`
Quién quiere enterarse de qué, dentro de un espacio. `space_id` → spaces · `user_id` → users · `kind` · `enabled`
- `kind` hoy solo es `recurring_due`. Único por `(space_id, user_id, kind)`.
- El recordatorio de planificación no está aquí: es preferencia de usuario y vive en `user_settings`.
