# Implementation Plan: Keyboard QWERTY + TextInputGroup Integration

## Overview

Este plan conecta el teclado virtual `KeyboardQwerty` con `TextInputGroup` a través del `KeyboardStore` de Zustand. Las tareas siguen el orden de dependencias: primero los tipos, luego el store, luego los componentes consumidores, y finalmente los tests. Cada paso produce código integrado y funcional antes de avanzar al siguiente.

## Tasks

- [ ] 1. Actualizar tipos en `keyboard.state.ts`
  - Añadir `SyncCallback = (value: string) => void` como tipo exportado
  - Añadir `syncCallbacks: Record<InputId, SyncCallback>` al estado
  - Añadir acciones: `registerSyncCallback`, `unregisterSyncCallback`, `toggleActiveInput`, `enter`, `reset`
  - Cambiar firma de `setIsOpen` para aceptar parámetro opcional `(open?: boolean) => void`
  - Eliminar `focusInput` (reemplazado por `toggleActiveInput`)
  - _Requirements: 7.1, 7.2, 2.1, 5.1_

- [ ] 2. Implementar nuevas acciones en `keyboard.store.ts`
  - [ ] 2.1 Inicializar `syncCallbacks: {}` en el estado inicial e implementar `registerSyncCallback` y `unregisterSyncCallback`
    - `registerSyncCallback(id, callback)` almacena la función en `syncCallbacks[id]`
    - `unregisterSyncCallback(id)` elimina la entrada de `syncCallbacks`
    - _Requirements: 7.1, 7.2_

  - [ ] 2.2 Modificar `write(char)` para invocar la `SyncCallback` tras actualizar `inputs`
    - Después de actualizar `inputs[activeInput]`, invocar `syncCallbacks[activeInput]?.(newValue)`
    - Si no hay `activeInput` o no hay callback registrada, no-op sin errores
    - _Requirements: 3.1, 3.3, 7.3_

  - [ ]* 2.3 Escribir property test para `write` con callback (Property 4)
    - **Property 4: Sincronización bidireccional store ↔ RHF**
    - **Validates: Requirements 3.3, 8.2**

  - [ ] 2.4 Modificar `backspace()` para invocar la `SyncCallback` tras actualizar `inputs`
    - Después de eliminar el último carácter, invocar `syncCallbacks[activeInput]?.(newValue)`
    - Si `inputs[activeInput] === ''`, mantener `''` sin errores
    - _Requirements: 4.1, 4.2, 4.3, 7.4_

  - [ ]* 2.5 Escribir property test para backspace idempotente en cadena vacía (Property 6)
    - **Property 6: Backspace en cadena vacía es idempotente**
    - **Validates: Requirements 4.3**

  - [ ] 2.6 Implementar `toggleActiveInput(id)`
    - Si `activeInput === id` → `setIsOpen(false)` + `activeInput = null`
    - Si `activeInput !== id` → `activeInput = id` + `setIsOpen(true)`
    - _Requirements: 2.1, 2.2, 2.4, 2.5_

  - [ ] 2.7 Implementar `enter()`
    - Ejecutar `setIsOpen(false)`
    - No modificar `activeInput` ni los valores de `inputs`
    - _Requirements: 5.1, 5.2_

  - [ ] 2.8 Modificar `unregisterInput(id)` para resetear `activeInput` si coincide
    - Si `activeInput === id`, establecer `activeInput = null`
    - _Requirements: 1.2_

  - [ ] 2.9 Modificar `setIsOpen` para aceptar parámetro booleano opcional
    - `setIsOpen(open?: boolean)`: si se pasa valor, usarlo; si no, hacer toggle
    - _Requirements: 2.2, 5.1_

  - [ ] 2.10 Implementar `reset()`
    - Restablecer `inputs`, `syncCallbacks`, `activeInput` e `isOpen` a sus valores iniciales
    - _Requirements: 1.2_

  - [ ]* 2.11 Escribir property test para aislamiento de escritura (Property 7)
    - **Property 7: Escritura solo afecta al activeInput**
    - **Validates: Requirements 6.3_**

  - [ ]* 2.12 Escribir property test para preservación de estado en registro/desregistro (Property 5)
    - **Property 5: Registro y desregistro de inputs preserva el estado de los demás**
    - **Validates: Requirements 6.1, 6.4**

- [ ] 3. Checkpoint — store completo
  - Asegurarse de que todos los tests del store pasan. Consultar al usuario si surgen dudas.

- [ ] 4. Integrar `TextInputGroup` con el `KeyboardStore`
  - [ ] 4.1 Añadir `useEffect` de registro/desregistro en `CustomInputGroup`
    - Al montar con `withKeyboard: true`: llamar `store.registerInput(field.name, field.value ?? '')` y `store.registerSyncCallback(field.name, field.onChange)`
    - Cleanup al desmontar: `store.unregisterInput(field.name)` + `store.unregisterSyncCallback(field.name)`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.1, 7.2_

  - [ ]* 4.2 Escribir unit tests para el ciclo de vida de registro en `TextInputGroup`
    - Montar con `withKeyboard: true` → verifica entradas en el store
    - Desmontar → verifica limpieza del store
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ] 4.3 Cambiar el `onClick` del botón `<Keyboard />` de `setIsOpen` a `toggleActiveInput(field.name)`
    - Reemplazar `onClick={setIsOpen}` por `onClick={() => store.toggleActiveInput(field.name)}`
    - _Requirements: 2.1, 2.2, 2.5_

  - [ ] 4.4 Añadir indicador visual de campo activo
    - Derivar `isActive = withKeyboard && store.activeInput === field.name`
    - Aplicar clase condicional al `InputGroup` o al botón de teclado cuando `isActive === true` (p. ej. `ring-2 ring-primary` o `text-primary`)
    - _Requirements: 2.3_

  - [ ] 4.5 Actualizar el `onChange` del `InputGroupInput` para sincronizar el store cuando `withKeyboard: true`
    - Después de `field.onChange(value)`, llamar `store.setValue(field.name, value)` si `withKeyboard`
    - _Requirements: 8.1, 8.3_

  - [ ]* 4.6 Escribir unit tests para sincronización nativa → store
    - Escribir en el input nativo → verificar que `store.inputs[field.name]` se actualiza
    - _Requirements: 8.1_

- [ ] 5. Actualizar `KeyboardQwerty` — handlers y área de visualización
  - [ ] 5.1 Conectar `handleKey` al store: reemplazar `onKeyPress?.(output)` por `store.write(output)`
    - Eliminar la prop `onKeyPress` del componente (o mantenerla como fallback opcional)
    - _Requirements: 3.1, 3.5_

  - [ ] 5.2 Activar y conectar el botón de backspace al store
    - Descomentar `{ icons:[Delete], onClick: backspace, className: 'text-xs' }` en la fila de letras
    - Conectar al `store.backspace()` en lugar del handler local
    - _Requirements: 4.1, 4.2_

  - [ ] 5.3 Conectar el botón `Enter` al store
    - Reemplazar `onClick: onEnter` por `onClick: handleEnter`
    - `handleEnter` invoca `store.enter()` y luego `props.onEnter?.()` si existe
    - Aplicar en ambos modos (letras y símbolos)
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ] 5.4 Añadir área de visualización en la parte superior del teclado
    - Leer `activeInput` e `inputs` del store con `useKeyboardStore`
    - Derivar `displayValue = activeInput ? inputs[activeInput] : null`
    - Renderizar el área con `pointer-events-none select-none border-b pb-2 mb-2`
    - Lógica de placeholder: `null` → `"Selecciona un campo"`, `''` → `"Escribe algo..."`, valor real → mostrarlo
    - Aplicar `text-muted-foreground text-sm` a los placeholders y `text-sm font-medium` al valor real
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [ ]* 5.5 Escribir property test para el área de visualización — reflejo exacto del store (Property 1)
    - **Property 1: El área de visualización refleja exactamente el valor del store**
    - **Validates: Requirements 9.1, 9.6**

  - [ ]* 5.6 Escribir property test para escritura secuencial en el área de visualización (Property 2)
    - **Property 2: Escritura secuencial se refleja síncronamente en el área de visualización**
    - **Validates: Requirements 9.2**

  - [ ]* 5.7 Escribir property test para cambio de campo activo (Property 3)
    - **Property 3: Cambio de campo activo actualiza el área de visualización inmediatamente**
    - **Validates: Requirements 9.7**

- [ ] 6. Checkpoint — integración completa
  - Asegurarse de que todos los tests pasan. Consultar al usuario si surgen dudas.

- [ ] 7. Tests de integración `TextInputGroup` + `KeyboardQwerty`
  - [ ] 7.1 Escribir test de integración para flujo completo de escritura
    - Montar `TextInputGroup` + `KeyboardQwerty` juntos
    - Simular clic en ícono de teclado → verificar `activeInput` y apertura
    - Simular pulsaciones de teclas → verificar valor en RHF y en el área de visualización
    - _Requirements: 3.1, 3.2, 3.3, 9.1, 9.2_

  - [ ] 7.2 Escribir test de integración para múltiples inputs en el mismo formulario
    - Registrar dos campos con `withKeyboard: true`
    - Cambiar de campo activo → verificar independencia de valores
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ] 7.3 Escribir test de integración para backspace y Enter
    - Escribir varios caracteres → aplicar backspace → verificar valor
    - Presionar Enter → verificar que el teclado se cierra y el valor se mantiene
    - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.2_

- [ ] 8. Checkpoint final — todos los tests pasan
  - Asegurarse de que todos los tests unitarios, de propiedades y de integración pasan. Consultar al usuario si surgen dudas.

## Notes

- Las sub-tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia los requisitos específicos para trazabilidad
- Los tests de propiedades validan invariantes universales con fast-check (mínimo 100 iteraciones por propiedad)
- Los tests unitarios validan ejemplos concretos y casos borde
- Los tests de integración verifican el flujo completo entre componentes
- Los checkpoints garantizan validación incremental antes de avanzar de fase
- El orden de las fases respeta el grafo de dependencias: tipos → store → TextInputGroup → KeyboardQwerty → tests

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.6", "2.7", "2.8", "2.9", "2.10"] },
    { "id": 2, "tasks": ["2.2", "2.4"] },
    { "id": 3, "tasks": ["2.3", "2.5", "2.11", "2.12"] },
    { "id": 4, "tasks": ["4.1", "5.1", "5.2", "5.3"] },
    { "id": 5, "tasks": ["4.2", "4.3", "4.4", "4.5", "5.4"] },
    { "id": 6, "tasks": ["4.6", "5.5", "5.6", "5.7"] },
    { "id": 7, "tasks": ["7.1", "7.2", "7.3"] }
  ]
}
```
