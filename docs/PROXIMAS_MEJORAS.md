# Próximas Mejoras — shadcn-zod-formkit

> Análisis técnico del código fuente actual (v3.5.4) con propuestas de mejora orientadas a hacer la librería más dinámica, extensible y mantenible.  
> Cada mejora tiene su propio spec en `.kiro/specs/`.

---

## Estado actual del codebase

La librería cuenta con ~45 tipos de input, un sistema de `FieldProps` bien definido, integración con `react-hook-form` + Zod, un teclado virtual (`KeyboardQwerty`) y soporte básico para lógica condicional vía `showWhen`. El análisis a continuación parte de leer el código real.

---

## Resumen de specs planificados

| # | Nombre | Spec | Prioridad | Estado |
|---|--------|------|-----------|--------|
| 1 | FakeInput — navegación Tab/Shift+Tab | `fake-input-tab-navigation` | 🔴 Alta | 📋 Requirements |
| 2 | autoValidIcons — reactivar con useWatch | `auto-valid-icons` | 🔴 Alta | 📋 Requirements |
| 3 | Keyboard store — inmutabilidad Zustand | `keyboard-store-immutability` | 🔴 Alta | 📋 Requirements |
| 4 | flattenFields — propagar onAnyFieldChange | `flatten-fields-propagation` | 🟡 Media | 📋 Requirements |
| 5 | showWhen — reactivo con useWatch | `show-when-reactive` | 🔴 Alta | 📋 Requirements |
| 6 | InputTypes — completar registro | `input-types-registry` | 🔴 Alta | 📋 Requirements |
| 7 | TextInput — props UX (clearable, copyable…) | `text-input-ux-props` | 🟡 Media | 📋 Requirements |
| 8 | ListConfig.optionValue — tipo correcto | `list-config-option-value-type` | 🟢 Baja | 📋 Requirements |
| 9 | Accesibilidad aria-* en todos los inputs | `accessibility-aria-attributes` | 🟡 Media | 📋 Requirements |

---

## 1. FakeInput — Navegación Tab/Shift+Tab

**Spec:** `.kiro/specs/fake-input-tab-navigation/`

**Problema:** `FakeInput` es un `<div tabIndex={0}>` que intercepta todos los eventos de teclado desde `window` llamando `e.preventDefault()` de forma incondicional. Esto bloquea la tecla Tab — el usuario queda atrapado en el campo y no puede avanzar al siguiente.

**Archivo:** `fake-input.tsx`

```ts
// ❌ Bloquea Tab también
const handleKeyDown = (e: KeyboardEvent) => {
  e.preventDefault();  // ← bloquea Tab
  if (e.key === "Backspace") { backspace(); return; }
  ...
};
```

**Solución:** Detectar `e.key === "Tab"` antes del `preventDefault`, calcular el siguiente/anterior elemento enfocable en el DOM, mover el foco manualmente con `.focus()` y cerrar el teclado virtual si está abierto.

```ts
if (e.key === "Tab") {
  e.preventDefault();
  const focusables = getFocusableElements();
  const next = e.shiftKey ? getPrev(focusables, ref.current) : getNext(focusables, ref.current);
  if (next) {
    setIsOpen(false);
    setCurrentInputField(null);
    next.focus();
  }
  return;
}
```

**Impacto:** Alto. Bloqueaba toda la navegación por teclado en formularios con campos FakeInput.

---

## 2. autoValidIcons — Reactivar con `useWatch`

**Spec:** `.kiro/specs/auto-valid-icons/`

**Problema:** El bloque de renderizado de los iconos de validación está comentado en `text-input-group.tsx`. Configurar `autoValidIcons: true` no produce efecto visual alguno.

**Archivo:** `text-input-group.tsx`

```tsx
// ❌ Comentado — no renderiza nada
// {autoValidate && (
//   <div>
//     {isSubmitting ? iconLoadingState : isValid ? iconValidState : iconInvalidState}
//   </div>
// )}
```

Además, `isValid` se calcula con `useState` inicializado una sola vez, no reactivo.

**Solución:**

```tsx
const watchedValue = useWatch({ control: form.control, name: input.name });
const isValid = useMemo(() => isValidField(input, form), [watchedValue]);
// Y descomentar el bloque de renderizado
```

También hay un bug en el cálculo de `autoValidate`:
```ts
// ❌ Precedencia incorrecta — evalúa como: (groupConfig?.autoValidIcons ?? input.zodType) ? true : false
const autoValidate = groupConfig?.autoValidIcons ?? input.zodType ? true : false;
// ✅ Correcto
const autoValidate = groupConfig?.autoValidIcons !== undefined 
  ? groupConfig.autoValidIcons 
  : input.zodType !== undefined;
```

**Impacto:** Alto. Feature documentada y anunciada que no funcionaba.

---

## 3. Keyboard Store — Inmutabilidad (bug Zustand)

**Spec:** `.kiro/specs/keyboard-store-immutability/`

**Problema:** Los métodos `write` y `backspace` mutan el objeto `currentInputField` directamente en lugar de crear nuevas referencias. Esto rompe la reactividad de Zustand porque la referencia del objeto no cambia.

**Archivo:** `keyboard.store.ts`

```ts
// ❌ Mutación directa
write: (char) => set((state) => {
  let currentInputField = state.currentInputField;
  currentInputField.field.value += char;            // ← muta objeto existente
  set({ currentInputField: currentInputField });    // ← set() anidado (anti-patrón)
  currentInputField.field.onChange(newValue);
})
```

Además, `clear()` no actualiza `currentInputField`, solo limpia el mapa `inputs`.

**Solución:**

```ts
// ✅ Inmutable — nueva referencia
write: (char) => set((state) => {
  const current = state.currentInputField;
  if (!current?.field) return state;
  const newValue = (current.field.value ?? "") + char;
  current.field.onChange(newValue);
  return {
    currentInputField: {
      ...current,
      field: { ...current.field, value: newValue }
    }
  };
})
```

**Impacto:** Alto. Afecta la confiabilidad del teclado virtual en todos los inputs.

---

## 4. `flattenFields` — Propagar `onAnyFieldChange` recursivamente

**Spec:** `.kiro/specs/flatten-fields-propagation/`

**Problema:** Las llamadas recursivas de `flattenFields` no pasan el callback `onAnyFieldChange`, por lo que los campos anidados en layouts de filas/columnas nunca lo reciben.

**Archivo:** `definitions.ts`

```ts
// ❌ onAnyFieldChange se pierde en la recursión
for (const field of fields) {
  if (Array.isArray(field)) {
    result.push(...flattenFields(field)); // ← no pasa onAnyFieldChange
  }
}
```

**Solución:** Una línea:

```ts
result.push(...flattenFields(field, onAnyFieldChange)); // ✅
```

**Impacto:** Medio. `onAnyFieldChange` no dispara en formularios con layout en filas.

---

## 5. `showWhen` — Evaluación Reactiva

**Spec:** `.kiro/specs/show-when-reactive/`

**Problema:** `FormFieldsGrid` usa `form.watch()` para obtener valores, lo que puede producir evaluaciones obsoletas de `showWhen` si React agrupa o difiere renders. Además, la prop `hidden: true` no se respeta en `shouldShowField`.

**Archivo:** `FormFieldsGrid.tsx`

**Solución:**
- Reemplazar `form.watch()` por `useWatch({ control: form.control })`
- Añadir evaluación de `hidden` antes de `showWhen` (cortocircuito)

```tsx
const allValues = useWatch({ control: form.control });
const shouldShowField = (field, values) => {
  if (field.hidden) return false;  // ← nuevo: hidden tiene precedencia
  if (typeof field.showWhen === 'function') {
    try { return !!field.showWhen(values); }
    catch { return true; }
  }
  return true;
};
```

**Impacto:** Alto. Afecta todos los formularios con lógica condicional.

---

## 6. Completar Registro de `InputTypes`

**Spec:** `.kiro/specs/input-types-registry/`

**Problema:** Los tipos `DATE_RANGE`, `COUNTRY_SELECT`, `RANGE` y `FILE_UPLOAD` existen en el enum y en `inputMap` (el factory los resuelve bien), pero **faltan en el array `inputFieldComp`** que los consumidores usan para descubrir los tipos disponibles.

Además, `InputTypes.SEARCH` está mapeado a `TextInput` en lugar de su propio componente porque `SearchInput` es una función React, no una clase que extienda `BaseInput`.

**Archivo:** `input-types.ts`, `input-factory.tsx`

**Solución:** Añadir los 4 tipos al array + crear clase `SearchInput` que envuelva el componente funcional existente.

**Impacto:** Alto. Inputs declarados como disponibles que los consumidores no pueden descubrir.

---

## 7. TextInputGroup — Implementar Props UX

**Spec:** `.kiro/specs/text-input-ux-props/`

**Problema:** Estas props están declaradas en `FieldProps` pero **no tienen implementación** en ningún componente:

| Prop | Tipo | Comportamiento esperado |
|------|------|------------------------|
| `clearable` | `boolean` | Botón X en addon derecho que limpia el campo |
| `copyable` | `boolean` | Botón copiar en addon derecho → clipboard |
| `showCharCount` | `boolean` | Contador `actual/máximo` (requiere `maxLength`) |
| `debounce` | `number` | Retrasa `onChange`/`onAnyFieldChange` N ms |
| `helpText` | `string` | Panel expandible con ayuda contextual |

**Archivo:** `text-input-group.tsx`

**Impacto:** Alto. Un consumidor que configure estas props no verá efecto alguno.

---

## 8. `ListConfig.optionValue` — Corrección de Tipo

**Spec:** `.kiro/specs/list-config-option-value-type/`

**Problema:** El tipo actual es `InputOption | string | number | object`, siendo `string` el único valor semánticamente correcto (es el nombre de la propiedad a usar como valor).

**Archivo:** `definitions.ts`

```ts
// ❌ Tipo inconsistente
interface ListConfig {
  optionValue?: InputOption | string | number | object
}

// ✅ Correcto
interface ListConfig {
  optionValue?: string  // nombre de la propiedad del objeto que se usa como valor
}
```

Es un **breaking change** que requiere entrada en CHANGELOG y guía de migración.

**Impacto:** Bajo en funcionalidad, alto en DX. Todos los componentes internos ya tratan `optionValue` como `string` con castings explícitos.

---

## 9. Accesibilidad — Atributos `aria-*`

**Spec:** `.kiro/specs/accessibility-aria-attributes/`

**Problema:** Las props `ariaLabel`, `ariaDescribedBy`, `ariaRequired` están definidas en `FieldProps` pero nunca se aplican al elemento `<input>`. Tampoco se expone `aria-invalid` basado en el estado de error de react-hook-form.

**Archivo:** `definitions.ts`, `text-input-group.tsx` y todos los tipos de input.

**Solución:** Crear una función `AriaResolver` centralizada en `base/`:

```ts
export const resolveAriaAttributes = (input: FieldProps, fieldState: FieldState) => ({
  'aria-label': input.ariaLabel ?? input.label,
  ...(input.ariaDescribedBy || input.description
    ? { 'aria-describedby': input.ariaDescribedBy ?? `${String(input.name)}-description` }
    : {}),
  ...(input.ariaRequired ?? input.required
    ? { 'aria-required': true }
    : {}),
  ...(fieldState.isTouched && fieldState.error
    ? { 'aria-invalid': true }
    : {}),
});
```

Aplicar el resolver en `InputGroupInput` y propagar al resto de tipos de input.

**Impacto:** Medio. Requerido para cumplir WCAG 2.1 AA criterios 4.1.2, 1.3.1 y 1.3.5.

---

## Mejoras futuras (sin spec aún)

### `FormContext` — Eliminar prop drilling

`UseFormReturn` se pasa como prop en cascada por toda la jerarquía. Para `REPEATER` y `REPEATER_TABS` esto genera forms anidados difíciles de manejar.

**Propuesta:** `React.createContext` que exponga `form`, `isSubmitting` y callbacks. Los inputs consumen del contexto en lugar de recibir props.

**Impacto:** Alto (refactor estructural). No planificado aún por ser disruptivo.

---

### `formatNumber` — Extraer como utilidad compartida

`formatNumber` está definida localmente en `text-input-group.tsx` pero `NumberInput` tiene su propia implementación separada. Debería vivir en `base-input.ts`.

---

### Nuevos tipos de input

| Input | Notas |
|---|---|
| `RICH_TEXT` | Dependencia: `tiptap` o `quill` |
| `SIGNATURE` | Canvas + touch events |
| `CHIPS` | Tipo `STRING_LIST` con opciones predefinidas |
| `TEXTAREA` | El archivo existe, verificar que esté en el factory |

---

### Suite de tests

Con 45+ inputs y lógica de validación compleja, la cobertura actual es mínima. Prioridad con Vitest + Testing Library:

1. `flattenFields` — aplanamiento con todos los niveles de anidamiento
2. `handleOnChage` — callbacks y eventos DOM
3. `isValidField` — validación Zod y fieldState
4. `showWhen` + `hidden` — lógica condicional
5. Render básico por cada tipo de input

---

## Notas de implementación

- Los specs de bugs críticos (1-3) se deben ejecutar primero — corrigen comportamientos rotos
- Los specs 4-6 son el segundo bloque — mejoran la consistencia del sistema
- Los specs 7-9 son mejoras de calidad y pueden ir en paralelo
- El spec `FormContext` es un refactor de largo alcance y requiere análisis de impacto antes de planificarse
