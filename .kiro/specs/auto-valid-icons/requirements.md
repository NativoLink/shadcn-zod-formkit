# Requirements Document

## Introduction

La funcionalidad **autoValidIcons** permite que los campos de texto del formulario muestren un icono visual en tiempo real que refleja el estado de validación del campo mientras el usuario escribe. El icono cambia automáticamente entre tres estados: válido (CircleCheck verde), inválido (CircleX rojo/rosa) y enviando (Loader2 azul animado). Esta funcionalidad se activa mediante la propiedad `autoValidIcons` en `inputGroupConfig` o de forma implícita cuando el campo tiene un `zodType` definido. La actualización reactiva se logra mediante `useWatch` de `react-hook-form`, reemplazando la implementación actual basada en `useState` no reactivo.

## Glossary

- **AutoValidIcons_Feature**: El sistema de iconos de validación automática implementado en `CustomInputGroup` del componente `text-input-group.tsx`.
- **FieldValidator**: La utilidad `isValidField` definida en `base-input.ts` que evalúa la validez de un campo usando `zodType.safeParse` o `fieldState.error`.
- **IconRenderer**: El bloque de renderizado condicional dentro de `InputGroupAddon` que muestra el icono correspondiente al estado del campo.
- **autoValidate**: Bandera booleana derivada de `groupConfig?.autoValidIcons ?? input.zodType ? true : false` que controla si el `IconRenderer` está activo.
- **isSubmitting**: Prop booleana que indica que el formulario está en proceso de envío.
- **isValid**: Estado booleano que refleja si el valor actual del campo pasa la validación definida.
- **useWatch**: Hook de `react-hook-form` que suscribe el componente a los cambios de valor de un campo específico, forzando un re-render reactivo.
- **zodType**: Esquema Zod (`ZodTypeAny`) asociado al campo que se usa para validar el valor mediante `safeParse`.
- **CircleCheck**: Icono de Lucide React que representa el estado válido, renderizado en color `#00bf3e` (verde).
- **CircleX**: Icono de Lucide React que representa el estado inválido, renderizado en color `#ff8080` (rojo/rosa).
- **Loader2**: Icono de Lucide React que representa el estado de envío, renderizado con clase `animate-spin` en color `#1e90ff` (azul).
- **inputGroupConfig**: Propiedad de configuración de `FieldProps` que contiene la opción `autoValidIcons`.

---

## Requirements

### Requirement 1: Activación de AutoValidIcons

**User Story:** Como desarrollador de formularios, quiero activar los iconos de validación automática mediante una propiedad de configuración o implícitamente con un esquema Zod, para que los usuarios tengan retroalimentación visual sin configuración adicional.

#### Acceptance Criteria

1. WHEN `inputGroupConfig.autoValidIcons` es `true`, THE `AutoValidIcons_Feature` SHALL activar el `IconRenderer` para ese campo.
2. WHEN `inputGroupConfig.autoValidIcons` no está definido y `input.zodType` está presente, THE `AutoValidIcons_Feature` SHALL activar el `IconRenderer` para ese campo.
3. WHEN `inputGroupConfig.autoValidIcons` es `false` y `input.zodType` no está definido, THE `AutoValidIcons_Feature` SHALL omitir el renderizado del `IconRenderer`.
4. WHEN `inputGroupConfig.autoValidIcons` es `false` explícitamente, THE `AutoValidIcons_Feature` SHALL desactivar tanto la funcionalidad de `AutoValidIcons_Feature` como el `IconRenderer`, aunque `input.zodType` esté presente.

---

### Requirement 2: Actualización Reactiva del Estado de Validación

**User Story:** Como usuario del formulario, quiero que el icono de validación se actualice en tiempo real mientras escribo, para saber inmediatamente si mi entrada es correcta.

#### Acceptance Criteria

1. WHEN el valor del campo cambia, THE `AutoValidIcons_Feature` SHALL re-evaluar el estado de validación usando `useWatch` suscrito al campo `input.name`.
2. WHEN `useWatch` detecta un nuevo valor en el campo, THE `FieldValidator` SHALL ejecutar `isValidField(input, form, watchedValue)` para calcular el nuevo estado `isValid`.
3. THE `AutoValidIcons_Feature` SHALL derivar `isValid` como valor calculado a partir del valor observado por `useWatch`, sin depender de un `useState` actualizado manualmente.
4. IF `input.zodType` está definido, THEN THE `FieldValidator` SHALL usar `input.zodType.safeParse(value)` para determinar la validez, retornando `true` solo si `result.success` es `true`, y el éxito de Zod determina directamente la validez del campo.
5. IF `input.zodType` no está definido, THEN THE `FieldValidator` SHALL usar `form.getFieldState(input.name).error` para determinar la validez, retornando `true` solo si el error es `undefined` y el valor no es vacío.

---

### Requirement 3: Renderizado del Icono Según Estado

**User Story:** Como usuario del formulario, quiero ver un icono diferente para cada estado de validación (válido, inválido, enviando), para interpretar el estado del campo de un vistazo.

#### Acceptance Criteria

1. WHEN `autoValidate` es `true` e `isSubmitting` es `true`, THE `IconRenderer` SHALL mostrar el icono `Loader2` con clase CSS `animate-spin` y color `#1e90ff`, independientemente del valor de `isValid`.
2. WHEN `autoValidate` es `true`, `isSubmitting` es `false` e `isValid` es `true`, THE `IconRenderer` SHALL mostrar el icono `CircleCheck` con color `#00bf3e`.
3. WHEN `autoValidate` es `true`, `isSubmitting` es `false` e `isValid` es `false`, THE `IconRenderer` SHALL mostrar el icono `CircleX` con color `#ff8080`.
4. THE `IconRenderer` SHALL envolver el icono en un elemento `<div>` dentro del `InputGroupAddon` de lado derecho.
5. WHILE `autoValidate` es `false`, THE `IconRenderer` SHALL no renderizar ningún elemento visual de validación en el `InputGroupAddon`.

---

### Requirement 4: Compatibilidad con el `InputGroupAddon` existente

**User Story:** Como desarrollador de la librería, quiero que los iconos de validación se integren dentro del addon derecho existente, para mantener la consistencia visual del `InputGroup`.

#### Acceptance Criteria

1. THE `AutoValidIcons_Feature` SHALL renderizar el `IconRenderer` como un hijo del bloque `InputGroupAddon` con `align="inline-end"` ya existente.
2. THE `AutoValidIcons_Feature` SHALL coexistir con otros elementos del addon derecho (tooltip de información, texto derecho, iconos personalizados, toggle de contraseña, botón de teclado) sin desplazarlos ni ocultarlos.
3. WHEN `autoValidate` es `true`, THE `AutoValidIcons_Feature` SHALL incluir `autoValidate` en la condición `showInputGroupAddons`; IF otros factores hacen que `showInputGroupAddons` evalúe a `false`, THEN THE `IconRenderer` no se renderizará aunque `autoValidate` sea `true`.

---

### Requirement 5: Corrección del Cálculo de `autoValidate`

**User Story:** Como desarrollador de la librería, quiero que la bandera `autoValidate` se calcule correctamente según la precedencia de `autoValidIcons` sobre `zodType`, para evitar activaciones involuntarias.

#### Acceptance Criteria

1. WHILE la `AutoValidIcons_Feature` está habilitada, THE `AutoValidIcons_Feature` SHALL calcular `autoValidate` como `(groupConfig?.autoValidIcons !== undefined) ? groupConfig.autoValidIcons : (input.zodType !== undefined && input.zodType !== null)`.
2. WHEN `groupConfig?.autoValidIcons` es `false`, THE `AutoValidIcons_Feature` SHALL calcular `autoValidate` como `false` aunque `input.zodType` esté definido.
3. WHEN `groupConfig?.autoValidIcons` es `undefined` y `input.zodType` es `undefined`, THE `AutoValidIcons_Feature` SHALL calcular `autoValidate` como `false`.
