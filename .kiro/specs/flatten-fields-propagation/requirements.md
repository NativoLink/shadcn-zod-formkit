# Documento de Requisitos

## Introducción

La función `flattenFields` de `shadcn-zod-formkit` (v3.5.4) permite aplanar estructuras de campos anidados en un array plano de `FieldProps`. Al hacerlo, asigna a cada campo hoja el callback `onAnyFieldChange` recibido como parámetro.

El bug actual consiste en que las llamadas recursivas a `flattenFields` —tanto para arrays anidados como para objetos con propiedad `fields`— no propagan el parámetro `onAnyFieldChange`. Como consecuencia, los campos situados a dos o más niveles de profundidad nunca reciben el callback y el evento `onAnyFieldChange` nunca se dispara para ellos.

Este documento describe los requisitos para corregir esa propagación y garantizar que el callback llegue a todos los campos hoja independientemente de la profundidad de anidamiento.

---

## Glosario

- **FlattenFields**: Función exportada desde `src/components/custom/form/inputs/base/definitions.ts` que recorre recursivamente una estructura `FieldConfig<T>` y devuelve un array plano de `FieldProps<T>`.
- **FieldConfig**: Tipo recursivo `FieldProps<T> | FieldConfig<T>[]` que representa la configuración de campos de un formulario.
- **FieldProps**: Objeto hoja de configuración de un campo individual; contiene la propiedad opcional `onAnyFieldChange`.
- **onAnyFieldChange**: Callback opcional de tipo `(data: Record<string, any>) => void` que se invoca cada vez que cambia cualquier campo del formulario.
- **Campo hoja**: Elemento `FieldProps` que no contiene sub-campos; es el destinatario final del callback.
- **Nodo array**: Elemento de `FieldConfig` que es un `Array` y representa una fila o columna de la maquetación del formulario.
- **Nodo con fields**: Elemento de `FieldConfig` que es un objeto con propiedad `fields`, usado para agrupar campos.

---

## Requisitos

### Requisito 1: Propagación del callback en arrays anidados

**Historia de usuario:** Como desarrollador que usa la librería, quiero que `onAnyFieldChange` se propague correctamente a través de arrays anidados, para que todos los campos en diseños de filas y columnas reciban el callback.

#### Criterios de aceptación

1. WHEN `flattenFields` encuentra un elemento de tipo `Array` dentro de `fields`, THE `FlattenFields` SHALL invocar la llamada recursiva pasando el parámetro `onAnyFieldChange` original.
2. WHEN `onAnyFieldChange` es `undefined`, THE `FlattenFields` SHALL propagar `undefined` a las llamadas recursivas sin alterar el comportamiento actual.
3. WHEN un campo hoja se encuentra en un array de segundo nivel o superior, THE `FlattenFields` SHALL asignar el callback `onAnyFieldChange` a la propiedad `onAnyFieldChange` de dicho campo hoja.
4. WHEN `flattenFields` procesa un array con N niveles de anidamiento, THE `FlattenFields` SHALL asignar `onAnyFieldChange` a todos los campos hoja independientemente del nivel.

---

### Requisito 2: Propagación del callback en nodos con propiedad `fields`

**Historia de usuario:** Como desarrollador que usa la librería, quiero que `onAnyFieldChange` se propague correctamente a través de objetos agrupadores con propiedad `fields`, para que los campos anidados dentro de grupos también reciban el callback.

#### Criterios de aceptación

1. WHEN `flattenFields` encuentra un elemento que posee la propiedad `fields`, THE `FlattenFields` SHALL invocar la llamada recursiva sobre `field.fields` pasando el parámetro `onAnyFieldChange` original.
2. WHEN un campo hoja está contenido dentro de un nodo con `fields`, THE `FlattenFields` SHALL asignar `onAnyFieldChange` a la propiedad `onAnyFieldChange` de dicho campo hoja.
3. WHEN un nodo con `fields` contiene a su vez arrays anidados, THE `FlattenFields` SHALL propagar el callback a través de ambos niveles de anidamiento.

---

### Requisito 3: Comportamiento sin cambios para campos planos

**Historia de usuario:** Como desarrollador que usa la librería, quiero que la corrección no altere el comportamiento actual para estructuras planas, para evitar regresiones en formularios existentes.

#### Criterios de aceptación

1. WHEN `flattenFields` recibe un array de `FieldProps` sin ningún nivel de anidamiento, THE `FlattenFields` SHALL asignar `onAnyFieldChange` a cada campo exactamente igual que en la versión actual.
2. WHEN `onAnyFieldChange` no se proporciona, THE `FlattenFields` SHALL devolver el mismo array de `FieldProps` sin modificar la propiedad `onAnyFieldChange` de ningún campo.
3. THE `FlattenFields` SHALL mantener el orden original de los campos hoja en el array resultante con independencia de la profundidad de anidamiento.

---

### Requisito 4: Invarianza del resultado tras la corrección

**Historia de usuario:** Como desarrollador que mantiene la librería, quiero poder verificar mediante pruebas automáticas que la propagación es correcta, para prevenir regresiones futuras.

#### Criterios de aceptación

1. WHEN `flattenFields` recibe cualquier estructura válida de `FieldConfig` con `onAnyFieldChange` definido, THE `FlattenFields` SHALL producir un array en el que TODOS los campos hoja tienen asignado el callback `onAnyFieldChange`.
2. WHEN `flattenFields` recibe cualquier estructura válida de `FieldConfig` sin `onAnyFieldChange`, THE `FlattenFields` SHALL producir un array en el que NINGÚN campo hoja tiene modificada su propiedad `onAnyFieldChange` por la función.
3. WHEN se aplica `flattenFields` dos veces con el mismo `onAnyFieldChange` sobre estructuras equivalentes, THE `FlattenFields` SHALL producir arrays con los mismos campos hoja y el mismo callback asignado (propiedad idempotente del resultado).
