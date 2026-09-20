# Arquitectura de la web

`apps/web` — React 19, Vite, React Router, TanStack Query, Tailwind 4 y shadcn/ui sobre Base UI. PWA, pensada para móvil primero.
Este documento define dónde va cada cosa y qué reglas visuales no se negocian por pantalla.

## Estructura

```
src/
  main.tsx        monta la app
  app/            providers, router, guards de sesión, layout (header, nav, drawers)
  features/<x>/   una pantalla y lo que solo ella usa
  shared/         lo que usan dos o más features: api/, components/, spaces/, notify, routes
  components/ui/  primitivas de shadcn, copiadas por su CLI. No se editan a mano
  lib/            utilidades puras: formato de fecha y dinero, tema, cn
  config/         variables de entorno
```

**Dirección de dependencias: `shared → features → app`.**
`shared/` no importa de una feature. Una feature no importa de `app/`. Si dos features necesitan lo mismo, sube a `shared/`; si lo necesita el layout, vive en `shared/` y `app/` lo consume.

Dentro de una feature: el archivo de pantalla en la raíz, y `components/` y `hooks/` solo cuando hay tres o más. Con menos, se quedan en el archivo de la pantalla.

## Rutas y sesión

`app/router.tsx` declara el árbol; `shared/routes.ts` centraliza las rutas en `paths`. Ninguna pantalla escribe una URL a mano.

Las rutas son **en español**, porque las ve la persona: `/gastos`, `/plan`, `/espacios`, `/cuenta`, `/entrar`.

La protección es estructural, no por pantalla:

```
SessionBoundary        resuelve la sesión una vez
  RequireSession       todo lo de dentro exige sesión
    SpacesProvider     los espacios viven dentro de la sesión
      AppLayout        header, nav y el resto de pantallas
  RedirectSignedIn     /entrar, solo para quien está fuera
```

Una pantalla nueva colgada de `AppLayout` nace protegida sin que nadie se acuerde de protegerla.

Las pantallas se cargan con `lazy()`. Las que aún no existen usan `PendingScreen`, para que la navegación completa se pueda recorrer desde el primer día.

## Estado

**Estado de servidor: TanStack Query, y nada más.** No hay store global. Una query se define como `queryOptions` junto a su feature, o en `shared/` cuando el layout la necesita en todas las pantallas.

Configuración en `app/providers.tsx`: `staleTime` de 30s, sin refetch al enfocar la ventana, y sin reintentos ante errores 4xx — un 404 no mejora repitiéndolo.

Un 401 se maneja **una sola vez**, en el `QueryCache`: se limpia la caché entera (lo ya descargado seguiría en memoria y lo vería la siguiente persona en ese teléfono), se marca la sesión como nula y se avisa. Ninguna pantalla comprueba 401 por su cuenta.

**Espacio activo:** vive en `shared/spaces/spacesContext.tsx`, no en la URL. Se resuelve por tres fuentes, en orden: el parámetro `?espacio=` de un enlace compartido, la memoria de este navegador, y el primer espacio. El parámetro se lee al llegar y se retira de la URL: es una puerta, no un pasajero. La elección **no** se sincroniza entre dispositivos.

## API y contratos

Todo pasa por `shared/api/httpClient.ts`. Ninguna feature llama a `fetch`.

- `request(path, schema)` desenvuelve `{ data }` y valida la respuesta contra su contrato de `@walti/shared`. Si no encaja, lanza `contract_violation`: un backend que cambió sin avisar se detecta aquí y no tres pantallas más adentro.
- `requestNoContent(path)` para los endpoints que responden 204.
- Cualquier fallo sale como `ApiError` con `code`, `message` y `status`. **Se decide con `code`, nunca con el texto del mensaje.**
- Las peticiones van con `credentials: 'include'`: la sesión es una cookie, no una cabecera.

## Avisos al usuario

`shared/notify.ts`, tres funciones y ninguna más:

| Función | Para qué | Tono |
|---|---|---|
| `notifyDone` | Confirma algo que la persona acaba de hacer | Pasado: «Espacio archivado» |
| `notifyInfo` | Un hecho que no causó pero debe saber | Presente |
| `notifyFailed` | Algo falló. Nunca se traga el motivo | Incluye el mensaje del API |

Los errores de formulario se muestran en el campo, no en un toast.

## Componentes

| Carpeta | Qué va ahí |
|---|---|
| `components/ui/` | Primitivas de shadcn. Se añaden con su CLI y no se editan a mano |
| `shared/components/` | Piezas propias usadas por dos o más features, o por el layout |
| `features/<x>/components/` | Piezas de una sola pantalla, a partir de tres |

Estados vacíos, de error y de carga tienen su componente en `shared/components/`: `EmptyState`, `ErrorState`, `LoadingState`. No se improvisan por pantalla.

## Diseño visual

Tokens de Tailwind 4 en `index.css`, en oklch, con tema claro y oscuro. **Nunca se escribe un color literal**: siempre el token.

- **Cromo en `muted`, contenido en `background`.** La estructura se retira; lo que la persona vino a ver destaca.
- `accent` y `muted` tienen el mismo valor, así que `accent` es invisible sobre el cromo. Para un hover sobre superficie `muted` hace falta otro recurso.
- **Relleno sólido es acción; tono sin relleno es contexto.** Un botón se rellena, una etiqueta informativa no.
- **44px de área táctil mínima** en cualquier cosa pulsable.

**Tonos de espacio:** cuatro claves con nombre de significado en `shared/spaces/spaceTones.ts` — `emerald`, `sapphire`, `gold`, `amethyst` — asignadas por la posición del espacio en la lista. Cada una expone `accent`, `action`, `icon`, `solid` y `wash`. La cabecera adopta el `solid` del espacio activo y llega hasta el área segura, con transición de color: cambiar de espacio se ve antes de leerse.

No hay rojo entre los tonos: en una app sobre gastos, el rojo significa pasarse del presupuesto, y no puede significar además «este espacio».

## Verificación

`npx tsc --noEmit` en `apps/web`. El resto de la validación —navegador, móvil, tema oscuro— la hace el usuario; el entorno de desarrollo no ejecuta la build ni abre un navegador.
