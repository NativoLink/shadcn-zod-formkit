# Requirements Document

## Introduction

La interfaz `ListConfig` en `src/components/custom/form/inputs/base/definitions.ts` declara la propiedad `optionValue` con el tipo `InputOption | string | number | object`, lo cual es semánticamente incorrecto. El significado de `optionValue` es **el nombre de la propiedad** del objeto de opción que se utilizará como valor del formulario (p. ej. `"code"`, `"id"`, `"value"`). Por lo tanto, siempre debe ser de tipo `string`.

Adicionalmente, `FieldProps` ya expone `optionValue?: string` a nivel raíz, y varios componentes internos (select-input, combo-box-input, multi-select-input, check-list-input) resuelven el valor con el patrón `listConfig.optionValue ?? input.optionValue ?? "id"`, tratando el valor como `string` en tiempo de ejecución sin importar lo que declare el tipo. Esta discrepancia provoca que el compilador de TypeScript no detecte usos inválidos.

Este fix corrige el contrato de tipos, aclara la duplicación entre `FieldProps.optionValue` y `ListConfig.optionValue`, y proporciona una guía de migración para los consumidores de la librería.

---

## Glossary

- **ListConfig**: Interfaz que configura la lista de opciones para un campo de formulario (select, combobox, multi-select, checklist, etc.).
- **FieldProps**: Interfaz principal que describe la configuración completa de un campo del formulario dinámico.
- **optionValue**: Nombre (clave de propiedad `string`) del campo del objeto de opción que se usará como valor del formulario al seleccionar una opción.
- **optionLabel**: Nombre (clave de propiedad `string`) del campo del objeto de opción que se mostrará como etiqueta visible al usuario.
- **InputOption**: Objeto de opción estándar de la librería (`{ id, name, label?, value?, ... }`).
- **Tipo_de_unión_inconsistente**: Tipo TypeScript que combina valores de distintas naturalezas semánticas (`InputOption | string | number | object`) cuando solo uno es semánticamente correcto.
- **Guía_de_migración**: Instrucciones que permiten a los consumidores de la librería adaptar su código existente a los nuevos tipos sin romper su funcionalidad.

---

## Requirements

### Requirement 1: Corrección del tipo de `ListConfig.optionValue`

**User Story:** Como desarrollador consumidor de la librería, quiero que `ListConfig.optionValue` sea de tipo `string`, para que TypeScript me avise en tiempo de compilación si paso un valor que no sea un nombre de propiedad válido.

#### Acceptance Criteria

1. THE `ListConfig` SHALL declarar `optionValue` con el tipo `string | undefined` (es decir, `optionValue?: string`), eliminando `InputOption`, `number` y `object` del tipo de unión.
2. WHEN un consumidor asigna un valor de tipo `number`, `object` o `InputOption` a `ListConfig.optionValue`, THE compilador de TypeScript SHALL emitir un error de tipo en tiempo de compilación.
3. THE `ListConfig.optionLabel` SHALL mantener su tipo actual `string | undefined` (`optionLabel?: string`), dado que ya es semánticamente correcto y no requiere cambios.

---

### Requirement 2: Resolución de la duplicación entre `FieldProps.optionValue` y `ListConfig.optionValue`

**User Story:** Como desarrollador que mantiene la librería, quiero entender qué propiedad tiene precedencia cuando `optionValue` existe en dos lugares, para eliminar ambigüedad y evitar comportamientos inesperados en los consumidores.

#### Acceptance Criteria

1. THE `FieldProps` SHALL conservar su propiedad `optionValue?: string` a nivel raíz para compatibilidad retroactiva con usos directos sin `listConfig`.
2. WHEN un campo tiene tanto `FieldProps.optionValue` como `ListConfig.optionValue` definidos, THE componente de entrada SHALL dar precedencia a `listConfig.optionValue` sobre `input.optionValue`, respetando el orden de resolución: `listConfig?.optionValue ?? input.optionValue ?? "id"`.
3. THE código fuente de `definitions.ts` SHALL incluir un comentario que indique explícitamente que `ListConfig.optionValue` toma precedencia sobre `FieldProps.optionValue` cuando ambos están definidos.

---

### Requirement 3: Consistencia del comportamiento en tiempo de ejecución

**User Story:** Como desarrollador que mantiene la librería, quiero que todos los componentes que consumen `optionValue` lean ese valor como `string` sin castings adicionales, para que el comportamiento en tiempo de ejecución sea coherente con el tipo declarado.

#### Acceptance Criteria

1. THE componentes `select-input`, `combo-box-input`, `multi-select-input` y `check-list-input` SHALL acceder a `listConfig.optionValue` y tratarlo directamente como `string` sin necesidad de castings (`as string`) una vez corregido el tipo en `ListConfig`.
2. WHEN `listConfig.optionValue` no está definido, THE componente SHALL utilizar `input.optionValue` como valor de respaldo.
3. IF ni `listConfig.optionValue` ni `input.optionValue` están definidos, THEN THE componente SHALL utilizar `"id"` como valor predeterminado.
4. THE tipo de `optionValue` resuelto en tiempo de ejecución SHALL coincidir con el tipo `string` declarado en la interfaz, eliminando la discrepancia que actualmente requiere castings explícitos en `check-list-input.tsx`.

---

### Requirement 4: Guía de migración para consumidores de la librería

**User Story:** Como desarrollador consumidor de una versión anterior de la librería, quiero una guía clara de migración, para actualizar mi código sin errores de compilación al instalar la nueva versión.

#### Acceptance Criteria

1. THE guía de migración SHALL describir el cambio de tipo de `ListConfig.optionValue` de `InputOption | string | number | object` a `string`.
2. THE guía de migración SHALL incluir ejemplos de código mostrando el patrón de uso incorrecto (antes) y el correcto (después) para cada tipo eliminado: `number`, `object` e `InputOption`.
3. THE guía de migración SHALL indicar que los consumidores que ya usaban `optionValue` como `string` no requieren ningún cambio en su código.
4. WHEN un consumidor tenía `optionValue` asignado a un `number`, THE guía de migración SHALL instruir al consumidor a convertirlo a `string` (p. ej. reemplazar `optionValue: 1` por `optionValue: "id"`).
5. WHEN un consumidor tenía `optionValue` asignado a un `object` o a un `InputOption`, THE guía de migración SHALL instruir al consumidor a pasar el nombre de la propiedad deseada como `string` (p. ej. reemplazar `optionValue: { id: 1, name: "ES" }` por `optionValue: "code"`).

---

### Requirement 5: Actualización del CHANGELOG

**User Story:** Como mantenedor de la librería, quiero que el CHANGELOG refleje este cambio de tipo como un breaking change, para que los consumidores puedan identificarlo al revisar el historial de versiones.

#### Acceptance Criteria

1. THE `CHANGELOG.md` SHALL incluir una entrada de tipo `BREAKING CHANGE` describiendo que `ListConfig.optionValue` ha cambiado de `InputOption | string | number | object` a `string`.
2. THE entrada del CHANGELOG SHALL indicar la versión en la que se introduce el cambio.
3. THE entrada del CHANGELOG SHALL hacer referencia a la guía de migración para que los consumidores puedan adaptar su código.
