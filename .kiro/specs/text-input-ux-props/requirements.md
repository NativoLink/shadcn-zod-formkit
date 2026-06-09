# Requirements Document

## Introduction

Esta funcionalidad implementa cinco props de mejora de UX para el componente `CustomInputGroup` del tipo `TEXT_GROUP` en la librería `shadcn-zod-formkit`. Las props (`clearable`, `copyable`, `showCharCount`, `debounce` y `helpText`) ya están declaradas en la interfaz `FieldProps` de `definitions.ts`, pero no tienen ningún efecto en el renderizado ni en el comportamiento del componente. El objetivo es hacerlas funcionales sin romper la API pública existente ni afectar a ningún otro tipo de input.

## Glossary

- **CustomInputGroup**: Función de React definida en `text-input-group.tsx` que renderiza el grupo de input para campos de tipo `TEXT_GROUP`.
- **FieldProps**: Interfaz TypeScript en `definitions.ts` que describe todas las propiedades configurables de un campo del formulario.
- **InputGroupAddon**: Componente de UI shadcn que representa una zona de adornos (izquierda o derecha) dentro de un `InputGroup`.
- **RHF**: React Hook Form. Gestiona el estado interno del formulario.
- **handleOnChage**: Función utilitaria en `base-input.ts` que dispara los callbacks `onChange` y `onAnyFieldChange` del campo.
- **Debounce**: Técnica que retrasa la ejecución de una función hasta que hayan transcurrido N milisegundos desde la última invocación.
- **Portapapeles**: Área de almacenamiento temporal del sistema operativo accesible mediante la Clipboard API del navegador.
- **Contador_de_Caracteres**: Indicador visual con el formato `actual/máximo` que muestra cuántos caracteres se han escrito respecto al límite.
- **HelpText**: Texto de ayuda contextual que se muestra u oculta debajo de la descripción del campo al pulsar un botón de alternancia.

---

## Requirements

### Requirement 1: Botón de limpieza de campo (clearable)

**User Story:** Como usuario del formulario, quiero poder limpiar el valor de un campo de texto con un solo clic, para no tener que borrar el contenido manualmente.

#### Acceptance Criteria

1. WHEN `clearable` es `true` y el campo tiene un valor no vacío, THE `CustomInputGroup` SHALL renderizar un botón de limpieza dentro del `InputGroupAddon` derecho.
2. WHEN el usuario hace clic en el botón de limpieza, THE `CustomInputGroup` SHALL establecer el valor del campo a cadena vacía mediante `field.onChange("")`.
3. WHEN el usuario hace clic en el botón de limpieza, THE `CustomInputGroup` SHALL invocar `handleOnChage` con el valor vacío para disparar los callbacks `onChange` y `onAnyFieldChange`.
4. WHEN `clearable` es `true` y el campo tiene un valor vacío o `undefined`, THE `CustomInputGroup` SHALL ocultar el botón de limpieza.
5. WHEN `clearable` es `false` o no está definido, THE `CustomInputGroup` SHALL no renderizar el botón de limpieza.
6. WHILE el campo está deshabilitado (`disabled` es `true`), THE `CustomInputGroup` SHALL mantener el botón de limpieza deshabilitado y el botón de copia (si `copyable` también es `true`) igualmente deshabilitado.

---

### Requirement 2: Botón de copia al portapapeles (copyable)

**User Story:** Como usuario del formulario, quiero copiar el valor de un campo de texto al portapapeles con un clic, para poder usarlo en otra parte sin seleccionar el texto manualmente.

#### Acceptance Criteria

1. WHEN `copyable` es `true`, THE `CustomInputGroup` SHALL renderizar un botón de copia dentro del `InputGroupAddon` derecho.
2. WHEN el usuario hace clic en el botón de copia, THE `CustomInputGroup` SHALL invocar `navigator.clipboard.writeText` con el valor actual del campo.
3. WHEN la operación de copia es exitosa, THE `CustomInputGroup` SHALL cambiar el icono del botón a un estado de confirmación visual durante el timeout configurado (por defecto 2000 ms) antes de restaurar el icono original.
4. IF `navigator.clipboard` no está disponible en el entorno, THEN THE `CustomInputGroup` SHALL ignorar el clic sin lanzar ningún error no controlado.
5. WHEN `copyable` es `false` o no está definido, THE `CustomInputGroup` SHALL no renderizar el botón de copia.
6. WHILE el campo está deshabilitado (`disabled` es `true`), THE `CustomInputGroup` SHALL mantener el botón de copia con la misma apariencia visual que cuando el campo está habilitado, dado que copiar no modifica el valor del campo.

---

### Requirement 3: Contador de caracteres (showCharCount)

**User Story:** Como usuario del formulario, quiero ver cuántos caracteres he escrito respecto al límite máximo, para saber cuándo estoy cerca de alcanzar el límite permitido.

#### Acceptance Criteria

1. WHEN `showCharCount` es `true` y `maxLength` tiene un valor numérico definido, THE `CustomInputGroup` SHALL renderizar un indicador de texto con el formato `{longitud_actual}/{maxLength}` adyacente al `InputGroupAddon` derecho.
2. WHEN el valor del campo cambia, THE `CustomInputGroup` SHALL actualizar el Contador_de_Caracteres en cada pulsación de tecla sin esperar a los callbacks de debounce.
3. WHEN la longitud del valor actual es igual a `maxLength`, THE `CustomInputGroup` SHALL aplicar un estilo visual diferenciado al Contador_de_Caracteres (color rojo) para alertar al usuario.
4. IF `showCharCount` es `true` pero `maxLength` no está definido, THEN THE `CustomInputGroup` SHALL no renderizar el Contador_de_Caracteres y SHALL emitir una advertencia en consola indicando que `maxLength` es requerido.
5. WHEN `showCharCount` es `false` o no está definido, THE `CustomInputGroup` SHALL no renderizar el Contador_de_Caracteres.
6. THE `CustomInputGroup` SHALL propagar el atributo `maxLength` al elemento `<input>` HTML nativo cuando `maxLength` esté definido, de modo que el navegador aplique la restricción de longitud máxima.

---

### Requirement 4: Retraso de callbacks por debounce (debounce)

**User Story:** Como desarrollador integrador, quiero que los callbacks `onChange` y `onAnyFieldChange` se ejecuten con un retraso configurable en milisegundos, para evitar llamadas excesivas a APIs externas mientras el usuario escribe.

#### Acceptance Criteria

1. WHEN `debounce` tiene un valor numérico mayor que 0, THE `CustomInputGroup` SHALL actualizar el valor del campo en RHF (`field.onChange`) de forma inmediata en cada pulsación de tecla.
2. WHEN `debounce` tiene un valor numérico mayor que 0, THE `CustomInputGroup` SHALL retrasar la invocación de `handleOnChage` (y por tanto de `onChange` y `onAnyFieldChange`) el número de milisegundos especificado en `debounce`.
3. WHEN el usuario escribe caracteres sucesivos en un intervalo menor a `debounce` ms, THE `CustomInputGroup` SHALL cancelar las invocaciones pendientes de `handleOnChage` y emitir una única invocación tras el último carácter escrito.
4. WHEN el componente se desmonta, THE `CustomInputGroup` SHALL cancelar cualquier timer de debounce pendiente para evitar actualizaciones de estado en componentes desmontados.
5. WHEN `debounce` es exactamente `0`, `undefined` o no está definido, THE `CustomInputGroup` SHALL invocar `handleOnChage` de forma síncrona, preservando el comportamiento actual.
6. IF `debounce` recibe un valor negativo, THEN THE `CustomInputGroup` SHALL tratar el valor como `0` e invocar `handleOnChage` de forma síncrona sin aplicar ningún retraso.

---

### Requirement 5: Texto de ayuda expandible (helpText)

**User Story:** Como usuario del formulario, quiero poder ver un texto de ayuda adicional sobre un campo sin que ocupe espacio visible permanente, para mantener el formulario limpio y consultar la ayuda sólo cuando la necesite.

#### Acceptance Criteria

1. WHEN `helpText` tiene un valor de cadena no vacío, THE `FieldTextGroup` SHALL renderizar un botón de alternancia debajo del componente `FormDescription`.
2. WHEN el usuario hace clic en el botón de alternancia y el panel de HelpText está oculto, THE `FieldTextGroup` SHALL expandir y mostrar el contenido de `helpText`.
3. WHEN el usuario hace clic en el botón de alternancia y el panel de HelpText está visible, THE `FieldTextGroup` SHALL colapsar y ocultar el contenido de `helpText`.
4. THE `FieldTextGroup` SHALL inicializar el panel de HelpText en estado colapsado al montarse el componente.
5. WHEN `helpText` es cadena vacía, `undefined` o no está definido, THE `FieldTextGroup` SHALL no renderizar el botón de alternancia ni el panel de HelpText.
6. THE `FieldTextGroup` SHALL aplicar una transición de animación al expandir y colapsar el panel de HelpText para proporcionar retroalimentación visual al usuario.
