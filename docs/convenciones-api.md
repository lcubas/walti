# Convenciones del API

`apps/api` — Hono sobre AWS Lambda, TypeScript, Drizzle sobre Turso.
Este documento define dónde va cada cosa y cómo se llama. Es normativo: si algo no encaja en el vocabulario de aquí, se discute antes de inventar una carpeta.

## Estructura

```
src/
  app.ts          Hono: CORS, errorHandler, notFoundHandler, authHandler, rutas
  routes.ts       montaje de las features bajo /health y /v1
  container.ts    composition root: única instancia de cada cosa
  lambda.ts       adaptador Lambda · dev.ts servidor local
  config/         env, cookie de sesión, plantillas
  features/<x>/
    routes.ts     declara rutas y aplica validación
    controllers/  HTTP ↔ dominio
    useCases/     una operación de negocio
    services/     reglas de dominio y pasos reutilizables
  shared/
    database/     cliente, esquema, migraciones
    errors/       AppError y subclases
    http/         response, requestContext, middlewares/
    repositories/ interfaces, y drizzle/ con sus implementaciones
```

El vocabulario de una feature es cerrado: `routes.ts`, `controllers/`, `useCases/`, `services/`. Nada más.
Algo sube a `shared/` cuando lo usan dos o más features.

## Capas

| Capa | Responsabilidad | Puede importar |
|---|---|---|
| `routes.ts` | Declarar rutas, aplicar validación, montar middlewares | controllers, middlewares, contratos |
| `controllers/` | Traducir HTTP a dominio y de vuelta | **un** use case |
| `useCases/` | Una operación de negocio. Orquesta y compone | services de cualquier feature, interfaces de repository |
| `services/` | Reglas de dominio y pasos reutilizables | su propia feature y `shared/` |
| `repositories/*.ts` | Interfaces de persistencia, un agregado cada una | tipos de `shared/` |
| `repositories/drizzle/` | Implementaciones | Drizzle |

Reglas que sostienen la tabla:

- **Drizzle solo aparece en `repositories/drizzle/` y en `container.ts`.** Ninguna interfaz, service o use case menciona un tipo del ORM.
- **Un use case nunca llama a otro use case.** Si dos comparten un paso, ese paso es un service.
- **Un service no importa de otra feature.** El use case es el único que compone entre features, y eso evita ciclos por construcción.
- **El controller llama a un use case** salvo que la operación sea puro HTTP (borrar una cookie, por ejemplo). Un use case vacío es burocracia, no orden.
- La validación vive en la ruta, nunca en el controller.

## Nombres

| Elemento | Forma | Ejemplo |
|---|---|---|
| Archivo | `camelCase`, igual que su export principal | `createSpaceUseCase.ts` |
| Controller | `<Verbo HTTP><Recurso>Controller`, método `handle` | `PostSpaceController.handle` |
| Use case | `<Verbo><Objeto>UseCase`, método `execute` | `CreateSpaceUseCase.execute` |
| Service | `<Nombre>Service`, métodos verbo + objeto | `SpaceService.verifyCanArchive` |
| Repository | `<Nombre>Repository` y `Drizzle<Nombre>Repository` | `SpaceRepository.findForUser` |

Los nombres de archivo nunca empiezan por mayúscula: macOS no distingue mayúsculas y Linux sí, y un `PascalCase.ts` compila en local y rompe en el despliegue.

## Rutas

- Prefijo `/v1` para todo salvo `/health`.
- Recursos en plural y en inglés: `/spaces`, `/categories`.
- Todo lo que pertenece a un espacio cuelga de `/v1/spaces/:spaceId/…`. El espacio va en la ruta, no en un query param ni en una cabecera: así una petición mal formada falla, en vez de devolver datos de otro espacio en silencio.
- `spaceHandler` se monta sobre ese grupo, resuelve `:spaceId` y lo deja en el contexto para que ningún controller tenga que leerlo de la URL.
  *Pendiente: ese middleware todavía no comprueba la membresía del usuario sobre el espacio.*

Orden de montaje en `app.ts`: CORS → `onError` → `notFound` → `authHandler` → rutas. **La protección es por construcción:** el `authHandler` se registra antes que las rutas, así que una ruta nueva nace protegida; lo público se declara en su lista de excepciones.

## Validación

Se valida en la ruta con `validatorHandler`, que envuelve Valibot:

```ts
app.post('/', validatorHandler.json(CreateSpaceRequest), (c) =>
  postSpaceController.handle(c, c.req.valid('json')),
);
```

Objetivos disponibles: `json`, `form`, `param`. El controller recibe datos ya validados y tipados; no vuelve a comprobarlos.

## Respuestas

Todo cuerpo de éxito va envuelto:

```json
{ "data": { } }
```

Con los helpers de `shared/http/response.ts`: `ok` (200), `created` (201), `respond` para cualquier otro código.
**La única excepción es 204**, que no lleva cuerpo: `return c.body(null, 204);`

## Errores

Se lanzan, no se devuelven. `errorHandler` los convierte en respuesta:

```json
{ "error": { "code": "space_name_taken", "message": "Ya tienes un espacio con ese nombre.", "details": [] } }
```

| Clase | Estado | Cuándo |
|---|---|---|
| `BadRequestError` | 400 | Petición mal formada |
| `UnauthorizedError` | 401 | Sin sesión, o sesión inválida |
| `ForbiddenError` | 403 | Hay sesión, pero no puede hacerlo |
| `NotFoundError` | 404 | No existe, **o no es suyo** |
| `ConflictError` | 409 | Choca con una regla de negocio |
| `ValidationError` | 422 | Payload inválido; lleva `details` con `field` y `message` |

- `code` es `snake_case` y estable: la web decide con él, nunca con el texto.
- `message` está en español y es para la persona. Se escribe como se lo dirías a alguien, no como un log.
- Un recurso ajeno se responde 404, no 403: confirmar que existe ya filtra información.
- Cualquier otro error sale como `internal_error` con 500 y se registra en consola.

## Contratos compartidos

`packages/shared` (`@walti/shared`) contiene los esquemas Valibot y los tipos que usan API y web. Un contrato se define una vez ahí y se importa en los dos lados; no se duplica ningún tipo de request o response.

## Contenedor

`container.ts` es el único sitio donde se instancia algo. Sin inyección automática: repositorios, services, use cases y controllers se construyen a mano, en ese orden, y se exportan. Las rutas y los middlewares importan de ahí.

## Verificación

`npx tsc --noEmit` en `apps/api` es la comprobación obligatoria antes de dar nada por terminado. No hay pruebas automatizadas todavía; la validación funcional la hace el usuario.
