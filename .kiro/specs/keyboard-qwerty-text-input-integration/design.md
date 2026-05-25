# Design Document

## Overview

Este documento define la arquitectura técnica para integrar el teclado virtual `KeyboardQwerty` con el componente `TextInputGroup` a través del `KeyboardStore` de Zustand. La solución desacopla el teclado del formulario mediante callbacks de sincronización y un sistema de registro de inputs. Adicionalmente, el teclado renderiza un área de visualización en su parte superior que muestra el valor actual del campo activo, proporcionando contexto visual al usuario sin necesidad de mirar el formulario.

## Architecture

### Components & Systems

```
┌─────────────────────────────────────────────────────────┐
│                   React Form Maker Lib                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐         ┌──────────────────┐     │
│  │  TextInputGroup  │         │  KeyboardQwerty  │     │
│  │  (with RHF)      │         │  (UI Component)  │     │
│  └────────┬─────────┘         └────────┬─────────┘     │
│           │                            │               │
│           │ registerInput()            │               │
│           │ registerSyncCallback()     │               │
│           │ unregisterInput()          │               │
│           │ setValue()                 │               │
│           │ setActiveInput()           │               │
│           │ setIsOpen()                │ write()       │
│           │                            │ backspace()   │
│           │                            │ enter()       │
│           └───────────┬────────────────┘               │
│                       │                                 │
│              ┌────────▼────────┐                        │
│              │  KeyboardStore  │                        │
│              │   (Zustand)     │                        │
│              ├─────────────────┤                        │
│              │ State:          │                        │
│              │ - inputs{}      │                        │
│              │ - activeInput   │                        │
│              │ - isOpen        │                        │
│              │ - syncCallbacks │                        │
│              └─────────────────┘                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

#### 1. Registro al Montar
```
TextInputGroup monta con withKeyboard: true
  ↓
Efecto (useEffect) se dispara
  ↓
Llamar store.registerInput(field.name, field.value)
  ↓
Store añade entrada en inputs[field.name]
  ↓
Efecto retorna función de limpieza
  ↓
En desmonte: store.unregisterInput(field.name)
```

#### 2. Activación del Input
```
Usuario hace clic en ícono de Keyboard
  ↓
TextInputGroup llama store.setActiveInput(field.name) o toggleActiveInput(field.name)
  ↓
Store actualiza activeInput
  ↓
Store ejecuta setIsOpen(true) si está cerrado
  ↓
TextInputGroup renderiza visual de "activo"
```

#### 3. Escritura con Sincronización
```
Usuario presiona tecla en KeyboardQwerty
  ↓
KeyboardQwerty invoca store.write(char)
  ↓
Store obtiene el activeInput
  ↓
Store actualiza inputs[activeInput]
  ↓
Store invoca syncCallback registrada para activeInput
  ↓
TextInputGroup recibe el callback con newValue
  ↓
TextInputGroup llama field.onChange(newValue)
  ↓
RHF actualiza el valor en el formulario
  ↓
KeyboardQwerty re-renderiza el área de visualización con el nuevo valor
```

#### 4. Borrado (Backspace)
```
Usuario presiona Backspace en KeyboardQwerty
  ↓
KeyboardQwerty invoca store.backspace()
  ↓
Store elimina el último carácter de inputs[activeInput]
  ↓
Store invoca syncCallback registrada
  ↓
TextInputGroup recibe el callback
  ↓
TextInputGroup llama field.onChange(newValue)
  ↓
KeyboardQwerty re-renderiza el área de visualización con el valor actualizado
```

#### 5. Enter y Cierre
```
Usuario presiona Enter en KeyboardQwerty
  ↓
KeyboardQwerty invoca store.enter()
  ↓
Store ejecuta setIsOpen(false)
  ↓
Si existe onEnter prop en KeyboardQwerty, invocarlo
  ↓
Teclado se cierra, input mantiene el valor escrito
```

#### 6. Sincronización desde Input Nativo
```
Usuario escribe directamente en el input nativo
  ↓
InputGroupInput dispara onChange
  ↓
TextInputGroup llama field.onChange(newValue)
  ↓
TextInputGroup llama store.setValue(field.name, newValue)
  ↓
Store actualiza inputs[field.name]
```

#### 7. Cambio de Campo Activo (con área de visualización)
```
Usuario hace clic en ícono de teclado de un campo diferente
  ↓
TextInputGroup llama store.toggleActiveInput(nuevoField.name)
  ↓
Store actualiza activeInput al nuevo campo
  ↓
KeyboardQwerty re-renderiza el área de visualización
  ↓
Área muestra inputs[nuevoActiveInput] o placeholder si está vacío
```

## Components and Interfaces

### KeyboardQwerty

Componente UI que renderiza el teclado virtual QWERTY. Se conecta al `KeyboardStore` para leer el estado y ejecutar acciones de escritura.

#### Props
```typescript
interface KeyboardQwertyProps {
  onEnter?: () => void;  // Callback opcional al presionar Enter
}
```

#### Área de Visualización (Requirement 9)

El componente renderiza un área de visualización en su parte superior que refleja el valor actual del campo activo. Esta área es de solo lectura (`pointer-events: none`) y se actualiza síncronamente con cada operación del store.

```tsx
// Dentro del render de KeyboardQwerty
const displayValue = activeInput ? inputs[activeInput] : null;

<div className="border-b pb-2 mb-2 pointer-events-none select-none">
  {displayValue === null ? (
    <span className="text-muted-foreground text-sm">Selecciona un campo</span>
  ) : displayValue === '' ? (
    <span className="text-muted-foreground text-sm">Escribe algo...</span>
  ) : (
    <span className="text-sm font-medium">{displayValue}</span>
  )}
</div>
```

**Lógica de visualización:**
- `activeInput === null` → placeholder `"Selecciona un campo"` con `text-muted-foreground`
- `activeInput !== null && inputs[activeInput] === ''` → placeholder `"Escribe algo..."` con `text-muted-foreground`
- `activeInput !== null && inputs[activeInput] !== ''` → valor real con `text-sm font-medium`

#### Handlers de Teclas
```typescript
const handleKeyPress = (char: string) => {
  store.write(char);
};

const handleBackspace = () => {
  store.backspace();
};

const handleEnter = () => {
  store.enter();
  if (props.onEnter) {
    props.onEnter();
  }
};
```

---

### TextInputGroup

Componente de campo de texto con soporte para teclado virtual. Gestiona el registro en el store y la sincronización con RHF.

#### useEffect para Registro
```typescript
useEffect(() => {
  if (!withKeyboard) return;

  const initialValue = field.value ?? '';
  store.registerInput(field.name, initialValue);
  store.registerSyncCallback(field.name, field.onChange);

  return () => {
    store.unregisterInput(field.name);
    store.unregisterSyncCallback(field.name);
  };
}, [field.name, withKeyboard, field.value, field.onChange, store]);
```

#### Handler para Clic en Ícono de Keyboard
```typescript
const handleKeyboardClick = () => {
  store.toggleActiveInput(field.name);
};
```

#### Handler para Input Nativo onChange
```typescript
const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  const newValue = e.target.value;
  field.onChange(newValue);

  if (withKeyboard) {
    store.setValue(field.name, newValue);
  }
};
```

#### Render del Indicador Visual
```typescript
const isActive = withKeyboard && store.activeInput === field.name;
// Aplicar clases/estilos si isActive === true
```

---

### KeyboardStore (Zustand)

Store centralizado que gestiona el estado del teclado virtual y coordina la comunicación entre `KeyboardQwerty` y `TextInputGroup`.

#### Acciones Expuestas
```typescript
interface KeyboardStoreActions {
  registerInput(id: InputId, initialValue: string): void;
  unregisterInput(id: InputId): void;
  registerSyncCallback(id: InputId, callback: (value: string) => void): void;
  unregisterSyncCallback(id: InputId): void;
  setActiveInput(id: InputId): void;
  toggleActiveInput(id: InputId): void;
  setIsOpen(isOpen: boolean): void;
  write(char: string): void;
  backspace(): void;
  enter(): void;
  setValue(id: InputId, value: string): void;
  reset(): void;
}
```

## Data Models

### KeyboardStoreState
```typescript
type InputId = string;
type SyncCallback = (value: string) => void;

interface KeyboardStoreState {
  /** Valores actuales de todos los inputs registrados, indexados por field.name */
  inputs: Record<InputId, string>;

  /** Identificador del campo que actualmente tiene el foco lógico del teclado. null si ninguno */
  activeInput: InputId | null;

  /** Controla la visibilidad del teclado virtual */
  isOpen: boolean;

  /** Callbacks de sincronización registrados por cada campo para propagar cambios a RHF */
  syncCallbacks: Record<InputId, SyncCallback>;
}
```

### FieldProps (extensión relevante)
```typescript
interface FieldProps {
  // ... props existentes
  withKeyboard?: boolean;  // Habilita la integración con el teclado virtual
}
```

### ShiftMode
```typescript
type ShiftMode = 'off' | 'once' | 'on';
// 'off'  → sin shift
// 'once' → mayúscula para la siguiente tecla, luego vuelve a 'off'
// 'on'   → caps lock, todas las teclas en mayúscula
```

### DisplayValue (lógica derivada en KeyboardQwerty)
```typescript
// Valor derivado para el área de visualización — no es estado persistido
type DisplayValue = string | null;
// null         → activeInput es null (mostrar "Selecciona un campo")
// ''           → activeInput no es null pero inputs[activeInput] === '' (mostrar "Escribe algo...")
// string no vacío → mostrar el valor real
```

## Correctness Properties

*Una propiedad es una característica o comportamiento que debe mantenerse verdadero en todas las ejecuciones válidas del sistema. Las propiedades sirven como puente entre las especificaciones legibles por humanos y las garantías de corrección verificables por máquinas.*

### Property 1: El área de visualización refleja exactamente el valor del store

*Para cualquier* string no vacío establecido como `inputs[activeInput]` en el `KeyboardStore`, el área de visualización del `KeyboardQwerty` SHALL renderizar exactamente ese string sin modificaciones.

**Validates: Requirements 9.1, 9.6**

---

### Property 2: Escritura secuencial se refleja síncronamente en el área de visualización

*Para cualquier* secuencia de caracteres aplicada mediante llamadas sucesivas a `store.write(char)`, el área de visualización SHALL mostrar en cada render el valor acumulado exacto que resulta de concatenar todos los caracteres escritos hasta ese momento.

**Validates: Requirements 9.2**

---

### Property 3: Cambio de campo activo actualiza el área de visualización inmediatamente

*Para cualquier* par de campos registrados (campo A con valor X, campo B con valor Y), al cambiar `activeInput` de A a B, el área de visualización SHALL mostrar el valor Y de B (o el placeholder correspondiente si Y es vacío) en el mismo ciclo de render.

**Validates: Requirements 9.7**

---

### Property 4: Sincronización bidireccional store ↔ RHF

*Para cualquier* carácter escrito via `store.write(char)` o eliminado via `store.backspace()`, el valor en `inputs[activeInput]` SHALL ser idéntico al valor que RHF tiene para ese campo tras la invocación de la `SyncCallback`.

**Validates: Requirements 3.3, 8.2**

---

### Property 5: Registro y desregistro de inputs preserva el estado de los demás

*Para cualquier* conjunto de inputs registrados, registrar o desregistrar un input SHALL no modificar los valores de `inputs` ni las `syncCallbacks` de los demás campos registrados.

**Validates: Requirements 6.1, 6.4**

---

### Property 6: Backspace en cadena vacía es idempotente

*Para cualquier* estado donde `inputs[activeInput] === ''`, invocar `store.backspace()` cualquier número de veces SHALL mantener `inputs[activeInput]` como cadena vacía sin producir errores.

**Validates: Requirements 4.3**

---

### Property 7: Escritura solo afecta al activeInput

*Para cualquier* conjunto de inputs registrados y cualquier carácter escrito via `store.write(char)`, únicamente `inputs[activeInput]` SHALL cambiar; los valores de todos los demás inputs registrados SHALL permanecer inalterados.

**Validates: Requirements 6.3**

## Error Handling

### Operaciones sin activeInput
- `write(char)` con `activeInput === null` → no-op, sin errores ni efectos secundarios
- `backspace()` con `activeInput === null` → no-op, sin errores ni efectos secundarios
- `enter()` con `activeInput === null` → ejecuta `setIsOpen(false)` normalmente

### SyncCallback no registrada
- Si `write()` o `backspace()` se invocan y no existe `syncCallbacks[activeInput]`, el store actualiza `inputs[activeInput]` de todas formas pero no invoca ningún callback. No se lanza error.

### Registro duplicado
- Si `registerInput` es llamado con un `field.name` que ya existe en `inputs`, el store sobrescribe el valor existente con el nuevo `initialValue` sin duplicar la entrada (idempotente).

### Desmonte del activeInput
- Si el campo que es `activeInput` se desmonta, `unregisterInput` elimina la entrada de `inputs` y `syncCallbacks`, y restablece `activeInput` a `null`.

### Valores iniciales inválidos
- Si `field.value` es `undefined` o `null` al registrar, `inputs[field.name]` se inicializa como `''`.

### Backspace en cadena vacía
- `backspace()` sobre `inputs[activeInput] === ''` mantiene el valor como `''` sin producir errores ni comportamiento inesperado.

### Área de visualización con activeInput no registrado
- Si por alguna condición de carrera `activeInput` apunta a un `InputId` que no existe en `inputs`, el área de visualización trata el valor como `undefined` y lo renderiza como el placeholder de campo vacío (`"Escribe algo..."`), evitando errores de render.

## Testing Strategy

### Enfoque dual: unit tests + property-based tests

La estrategia combina tests de ejemplo para casos concretos y tests basados en propiedades para verificar invariantes universales. La librería de PBT elegida es **fast-check** (compatible con Vitest y el ecosistema TypeScript del proyecto).

### Tests unitarios (ejemplo-based)

**KeyboardStore:**
- `registerInput` / `unregisterInput` añade y quita entradas en `inputs`
- `registerSyncCallback` / `unregisterSyncCallback` gestiona callbacks correctamente
- `write()` actualiza `inputs[activeInput]` y llama la syncCallback
- `backspace()` elimina el último carácter y llama la syncCallback
- `enter()` ejecuta `setIsOpen(false)`
- `toggleActiveInput` activa/desactiva el campo correctamente
- `setValue()` sincroniza manualmente sin invocar syncCallback

**KeyboardQwerty — Área de Visualización:**
- Placeholder `"Selecciona un campo"` cuando `activeInput === null`
- Placeholder `"Escribe algo..."` cuando `activeInput !== null` e `inputs[activeInput] === ''`
- Valor real renderizado cuando `inputs[activeInput]` es no vacío
- `pointer-events: none` presente en el área de visualización
- Área actualizada al cambiar de campo activo

**TextInputGroup:**
- Montar con `withKeyboard: true` → registra en el store
- Desmontar → limpia el store
- Clic en keyboard icon → activa el input
- Escribir en input nativo → actualiza el store via `setValue`

**KeyboardQwerty:**
- Enter invoca `onEnter` prop si está definida
- Shift `'once'` envía mayúscula y vuelve a `'off'`

### Tests basados en propiedades (fast-check)

Cada test ejecuta mínimo **100 iteraciones**. Cada test referencia la propiedad con el tag:
`// Feature: keyboard-qwerty-text-input-integration, Property N: <texto>`

| Propiedad | Descripción | Generadores |
|-----------|-------------|-------------|
| **Property 1** | Área de visualización refleja exactamente el valor del store | `fc.string()` no vacío como valor de `inputs[activeInput]` |
| **Property 2** | Escritura secuencial se refleja síncronamente | `fc.array(fc.char())` como secuencia de teclas |
| **Property 3** | Cambio de campo activo actualiza el área inmediatamente | `fc.tuple(fc.string(), fc.string())` para valores de dos campos |
| **Property 4** | Sincronización bidireccional store ↔ RHF | `fc.string()` + mock de `field.onChange` |
| **Property 5** | Registro/desregistro preserva estado de otros inputs | `fc.array(fc.record({id: fc.string(), value: fc.string()}))` |
| **Property 6** | Backspace en cadena vacía es idempotente | `fc.nat()` como número de backspaces a aplicar |
| **Property 7** | Escritura solo afecta al activeInput | `fc.array(fc.char())` + múltiples inputs registrados |

### Tests de integración

- Montar `TextInputGroup` + `KeyboardQwerty` juntos → flujo completo de escritura
- Múltiples inputs en el mismo formulario → independencia de valores
- Cambio de campo activo con teclado abierto → área de visualización actualizada
- Escritura en input nativo → store sincronizado

### Tests E2E / UI

- Feedback visual del input activo (borde resaltado)
- Teclado abre y cierra correctamente
- Enter cierra el teclado
- Backspace borra caracteres visualmente
- Shift funciona correctamente

## Implementation Strategy

### Phase 1: KeyboardStore Enhancement
1. Añadir `syncCallbacks` al estado del store
2. Implementar `registerSyncCallback` y `unregisterSyncCallback`
3. Modificar `write()` y `backspace()` para invocar callbacks
4. Añadir `setValue(id, value)` para sincronización manual
5. Implementar `toggleActiveInput()` como helper

### Phase 2: TextInputGroup Integration
1. Importar y usar `KeyboardStore` en `TextInputGroup`
2. Implementar `useEffect` de registro/unregistro
3. Implementar handler para click en ícono de keyboard
4. Implementar handler para cambios en input nativo
5. Añadir indicador visual de "activo"

### Phase 3: KeyboardQwerty — Área de Visualización (Requirement 9)
1. Leer `activeInput` e `inputs` del store en el render
2. Derivar `displayValue = activeInput ? inputs[activeInput] : null`
3. Renderizar el área de visualización con la lógica de placeholder
4. Aplicar `pointer-events: none` y separación visual con `border-b`
5. Verificar que el área se actualiza síncronamente con `write()` y `backspace()`

### Phase 4: KeyboardQwerty — Handlers
1. Actualizar handlers existentes para usar el store correctamente
2. Verificar que `enter()` cierra el teclado
3. Verificar que shift, caps, backspace funcionan correctamente

### Phase 5: Testing & Validation
1. Pruebas unitarias para el store
2. Pruebas basadas en propiedades con fast-check
3. Pruebas de integración para múltiples inputs
4. Pruebas de sincronización con RHF
5. Pruebas de edge cases

## Files to Modify/Create

```
src/
├── stores/
│   └── keyboard.store.ts          (MODIFY: Add syncCallbacks, new actions)
├── components/
│   ├── keyboard-qwerty.tsx        (MODIFY: Add display area, update handlers)
│   └── text-input-group.tsx       (MODIFY: Add registration logic, sync)
└── types/
    └── keyboard.types.ts          (CREATE/MODIFY: Add InputId, SyncCallback types)
```
