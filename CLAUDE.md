# Walti

Aplicación web y PWA de control y planificación de gastos personales y compartidos.
Monorepo con pnpm workspaces y Turborepo.

```
apps/api        Hono + TypeScript, Lambda con Function URL vía SST
apps/web        React + Vite + React Router + TanStack Query, PWA, S3 + CloudFront vía SST
packages/shared @walti/shared — contratos Valibot y tipos que usan API y web
docs/           documentación de ingeniería
```

Stack: Hono · Valibot · React · Vite · React Router · TanStack Query · Tailwind 4 · shadcn/ui sobre Base UI · Turso/libSQL · Drizzle · UUIDv7 · SST v3 · vite-plugin-pwa.

## Qué leer y cuándo

Lee **solo** la doc que toque la tarea. No hace falta leerlas todas.

| Doc | Léela antes de |
|---|---|
| `docs/convenciones-api.md` | Tocar `apps/api`: capas, nombres, rutas, errores, respuestas |
| `docs/modelo-de-datos.md` | Tocar el esquema, una migración o una consulta |
| `docs/arquitectura-web.md` | Tocar `apps/web`: estructura, estado, componentes, reglas visuales |

El **Brief del producto** vive en Plane y solo define producto: visión, principios y alcance del MVP. No se lee para implementar.

## Comandos

| | |
|---|---|
| `pnpm typecheck` en la raíz | **Verificación obligatoria.** Es lo único automatizado |
| `pnpm lint:fix` | Lo ejecuta el usuario, no Claude |
| `pnpm db:migrate` | **Solo el usuario.** Claude no genera ni aplica migraciones |

`apps/web` usa referencias de proyecto: su `tsconfig.json` no tiene archivos propios, así que **`tsc --noEmit` ahí compila cero archivos y siempre pasa**. Usa `tsc -b`, o `pnpm typecheck`, que es lo que ejecuta Turbo.

No hay pruebas automatizadas. La build y la validación en navegador las hace el usuario.

## Flujo de trabajo

El backlog vive en el proyecto **WALTI** de Plane. Se trabaja **una HU a la vez** y nunca se empieza la siguiente sin que el usuario lo pida.

Antes de escribir código, Claude presenta qué va a construir y qué queda fuera, y espera confirmación. Durante la implementación se hace **solo el alcance aprobado**: nada de refactors no relacionados, features añadidas ni generalizaciones. Si aparece una mejora, se propone; no se incorpora sola.

Una HU es una **rebanada vertical**: se cierra con API y web terminadas. Si por tamaño conviene partirla, Claude **pide permiso explícito** para hacerlo y para crear la HU que recoge el resto; sin ese permiso, no se cierra a medias.

Estados de Plane: `Backlog` → `Todo` → `In Progress` → `En revisión` → `Done`.
Claude mueve los estados y avisa. **`Done` nunca sin aceptación explícita del usuario.**

Al traer una HU, pide solo los campos que necesitas (`fields=name,description_stripped`): la descripción en HTML cuesta varias veces más y no aporta nada.

**No dejes comentarios en las HU** y **no crees tareas nuevas** salvo que el usuario lo pida.

## Límites

- **Git es de solo lectura por defecto.** `status`, `diff`, `log`, `show`, `branch --show-current`. Cualquier cosa que modifique working tree, index, referencias o repositorio se explica, se reconfirma y solo entonces se ejecuta. Nunca se hace commit al terminar una HU.
- **Nada destructivo.** Ni borrar archivos, ni `drop`/`truncate`, ni tocar recursos de AWS o Turso. Si hace falta, se explica qué ejecutar y lo hace el usuario.
- **Nada contra los proveedores cloud del usuario**, ni siquiera un `curl` de conectividad.
- **Nunca abrir `.env` ni ficheros de credenciales**, ni para ver su forma. Para saber qué variables existen, `.env.example`.
- **Ninguna dependencia nueva sin aprobación previa.** Se presenta qué resuelve, alternativas, licencia e impacto. Autorizadas hasta hoy: `uuidv7`.
- **Antes de usar una librería o servicio por primera vez**, se consulta su documentación oficial vigente en lugar de asumir su API de memoria. Si no se pudo verificar, se dice.

## Estilo

- Código, identificadores y comentarios en **inglés**. Texto de cara al usuario en **español**.
- Tabs para indentar. Lo impone Biome; no lo discutas con el formateador.
- Los comentarios explican **por qué**, no qué. Un comentario que narra la línea siguiente sobra.
- JSDoc en interfaces públicas: `@param`, `@returns`, `@throws`. Puntual y técnico.
