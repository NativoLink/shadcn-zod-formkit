# Requirements Document

## Introduction

Esta feature conecta el teclado virtual `KeyboardQwerty` con el componente `text-input-group.tsx` de la librería `react-form-maker-lib`. El objetivo es que cuando un usuario haga clic en el ícono de teclado dentro de un campo de texto (cuando `withKeyboard === true`), ese campo quede registrado como el input activo en el `KeyboardStore`, el teclado virtual se abra, y cada tecla presionada actualice el valor del campo correspondiente a través de `react-hook-form` (`field.onChange`). La sincronización entre el estado interno del store y el estado de `react-hook-form` es el problema central a resolver.

## Glossary

- **KeyboardStore**: Store Zustand (`keyboard.store.ts`) que gestiona el estado del teclado virtual: `activeInput`, `inputs`, `isOpen` y sus acciones asociadas.
- **KeyboardQwerty**: Componente React (`keyboard-qwerty.tsx`) que renderiza el teclado virtual QWERTY con soporte para letras, símbolos, shift, caps y backspace.
- **TextInputGroup**: Componente React (`text-input-group.tsx`) que renderiza un campo de texto con soporte para grupos de iconos, validación y teclado virtual.
- **ActiveInput**: El identificador (`string`) del campo de texto que actualmente tiene el foco lógico en el `KeyboardStore`.
- **FieldProps**: Interfaz TypeScript que define la configuración de un campo de formulario, incluyendo la propiedad `withKeyboard`.
- **RHF**: React Hook Form — librería de gestión de estado de formularios usada en la librería.
- **InputId**: Identificador único (`string`) de un campo de texto registrado en el `KeyboardStore`, derivado de `field.name`.
- **SyncCallback**: Función de callback (`(value: string) => void`) que el `TextInputGroup` registra en el `KeyboardStore` para recibir actualizaciones de valor y propagarlas a RHF via `field.onChange`.

## Requirements

### Requirement 1: Registro del input en el KeyboardStore al montar

**User Story:** Como desarrollador que usa la librería, quiero que cada campo con `withKeyboard: true` se registre automáticamente en el `KeyboardStore` al montarse, para que el teclado virtual pueda identificarlo y escribir en él.

#### Acceptance Criteria

1. WHEN un `TextInputGroup` con `withKeyboard: true` se monta en el DOM, THE `KeyboardStore` SHALL añadir una entrada en `inputs` con clave `field.name` e inicializarla con el valor actual del campo en RHF (`field.value ?? ''`).
2. WHEN un `TextInputGroup` con `withKeyboard: true` se desmonta del DOM, THE `KeyboardStore` SHALL eliminar la entrada `inputs[field.name]` y, si `activeInput === field.name`, restablecer `activeInput` a `null`.
3. WHILE al menos un `TextInputGroup` con `withKeyboard: true` está montado, THE `KeyboardStore` SHALL contener una entrada en `inputs` por cada uno de esos campos.
4. IF un campo con `withKeyboard: true` se monta con un valor inicial no vacío en RHF, THEN `inputs[field.name]` SHALL ser igual a ese valor inicial tras el montaje.
5. IF el valor inicial del campo en RHF es `undefined` o `null` al montar, THEN `inputs[field.name]` SHALL inicializarse como cadena vacía (`''`).
6. IF `registerInput` es llamado con un `field.name` que ya existe en `inputs`, THEN THE `KeyboardStore` SHALL sobrescribir el valor existente con el nuevo `initialValue` sin duplicar la entrada.

---

### Requirement 2: Activación del input al hacer clic en el ícono de teclado

**User Story:** Como usuario final, quiero que al hacer clic en el ícono de teclado de un campo específico, ese campo quede activo y el teclado virtual se abra, para poder escribir en él.

#### Acceptance Criteria

1. WHEN el usuario hace clic en el botón con ícono `<Keyboard />` de un `TextInputGroup`, THE campo SHALL quedar establecido como el input activo en el store, de modo que las pulsaciones subsiguientes del teclado virtual afecten únicamente a ese campo.
2. WHEN el usuario hace clic en el botón con ícono `<Keyboard />` de un `TextInputGroup` y el teclado virtual está cerrado, THE teclado virtual SHALL mostrarse visible al usuario.
3. WHILE un campo está establecido como input activo, THE campo SHALL mostrar un indicador visual distinguible (p. ej. borde resaltado o ícono activo) que lo diferencie de los demás campos del formulario.
4. IF el teclado ya está abierto y el usuario hace clic en el ícono de teclado de un campo diferente, THEN THE campo activo SHALL cambiar al nuevo campo sin cerrar el teclado virtual.
5. IF el usuario hace clic en el ícono de teclado del mismo campo que ya está activo y el teclado está abierto, THEN THE teclado virtual SHALL cerrarse y el campo SHALL dejar de estar marcado como activo.

---

### Requirement 3: Sincronización de escritura del teclado con react-hook-form

**User Story:** Como usuario final, quiero que cada tecla que presione en el teclado virtual actualice el valor del campo activo en el formulario, para que el formulario refleje lo que escribo.

#### Acceptance Criteria

1. WHEN el usuario presiona una tecla alfanumérica o de símbolo en el `KeyboardQwerty`, THE `KeyboardStore` SHALL invocar la `SyncCallback` registrada para el `activeInput` con el nuevo valor completo del campo.
2. WHEN la `SyncCallback` es invocada, THE `TextInputGroup` SHALL llamar `field.onChange(newValue)` de RHF con el nuevo valor, para que el formulario quede actualizado.
3. THE `KeyboardStore` SHALL mantener `inputs[activeInput]` sincronizado con el valor actual del campo activo en todo momento.
4. IF no hay ningún `activeInput` establecido en el `KeyboardStore`, THEN THE `KeyboardQwerty` SHALL ignorar las pulsaciones de teclas sin producir efectos secundarios.
5. WHEN el usuario presiona una tecla en el `KeyboardQwerty` con `shiftMode === 'once'`, THE `KeyboardQwerty` SHALL enviar el carácter en mayúscula y luego restablecer `shiftMode` a `'off'`.

---

### Requirement 4: Funcionalidad de borrado (Backspace)

**User Story:** Como usuario final, quiero que el botón de borrar del teclado virtual elimine el último carácter del campo activo, para poder corregir errores de escritura.

#### Acceptance Criteria

1. WHEN el usuario presiona el botón de borrar (`backspace`) en el `KeyboardQwerty`, THE `KeyboardStore` SHALL eliminar el último carácter de `inputs[activeInput]`.
2. WHEN el `KeyboardStore` actualiza `inputs[activeInput]` por un backspace, THE `TextInputGroup` SHALL llamar `field.onChange(newValue)` de RHF con el valor resultante.
3. IF `inputs[activeInput]` es una cadena vacía y el usuario presiona backspace, THEN THE `KeyboardStore` SHALL mantener el valor como cadena vacía sin producir errores.

---

### Requirement 5: Funcionalidad de Enter y cierre del teclado

**User Story:** Como usuario final, quiero que al presionar Enter en el teclado virtual el teclado se cierre, para indicar que terminé de escribir en ese campo.

#### Acceptance Criteria

1. WHEN el usuario presiona el botón `Enter` en el `KeyboardQwerty`, THE `KeyboardStore` SHALL ejecutar `setIsOpen()` para cerrar el teclado virtual.
2. WHEN el teclado se cierra por acción de Enter, THE `KeyboardStore` SHALL mantener el `activeInput` con su valor actual en RHF sin modificarlo.
3. WHERE el consumidor de la librería provea una prop `onEnter` al `KeyboardQwerty`, THE `KeyboardQwerty` SHALL invocar `onEnter` además de cerrar el teclado.

---

### Requirement 6: Soporte para múltiples inputs con teclado en el mismo formulario

**User Story:** Como desarrollador que usa la librería, quiero que múltiples campos con `withKeyboard: true` en el mismo formulario funcionen de forma independiente, para que el usuario pueda editar cada campo por separado.

#### Acceptance Criteria

1. THE `KeyboardStore` SHALL soportar el registro simultáneo de múltiples campos con `withKeyboard: true` en el objeto `inputs`.
2. WHEN el usuario hace clic en el ícono de teclado de un campo diferente al `activeInput` actual, THE `KeyboardStore` SHALL actualizar `activeInput` al nuevo campo y sincronizar el valor correcto.
3. WHILE un campo es el `activeInput`, THE `KeyboardQwerty` SHALL escribir únicamente en ese campo sin afectar los valores de los demás campos registrados.
4. WHEN el usuario cambia de campo activo, THE `KeyboardStore` SHALL preservar los valores previamente escritos en los campos no activos tanto en `inputs` como en RHF.

---

### Requirement 7: Registro de SyncCallback para propagación a react-hook-form

**User Story:** Como desarrollador de la librería, quiero que el `KeyboardStore` soporte el registro de callbacks de sincronización por campo, para desacoplar el store de react-hook-form y mantener la arquitectura limpia.

#### Acceptance Criteria

1. THE `KeyboardStore` SHALL exponer una acción `registerSyncCallback(id: InputId, callback: SyncCallback)` que almacene la función de sincronización asociada a cada campo.
2. THE `KeyboardStore` SHALL exponer una acción `unregisterSyncCallback(id: InputId)` que elimine la función de sincronización cuando el campo se desmonte.
3. WHEN `write(char)` es invocado en el `KeyboardStore`, THE `KeyboardStore` SHALL invocar la `SyncCallback` registrada para el `activeInput` con el nuevo valor completo.
4. WHEN `backspace()` es invocado en el `KeyboardStore`, THE `KeyboardStore` SHALL invocar la `SyncCallback` registrada para el `activeInput` con el valor resultante tras eliminar el último carácter.
5. IF no existe una `SyncCallback` registrada para el `activeInput`, THEN THE `KeyboardStore` SHALL actualizar `inputs[activeInput]` sin producir errores.

---

### Requirement 8: Consistencia del valor entre el store y react-hook-form

**User Story:** Como desarrollador que usa la librería, quiero que el valor del campo en RHF y el valor en el `KeyboardStore` estén siempre sincronizados, para evitar inconsistencias en el estado del formulario.

#### Acceptance Criteria

1. WHEN el valor de un campo es modificado directamente por el usuario a través del `InputGroupInput` nativo (sin usar el teclado virtual), THE `TextInputGroup` SHALL actualizar `inputs[field.name]` en el `KeyboardStore` via `setValue(field.name, newValue)`.
2. WHEN el `KeyboardStore` escribe un valor via `write(char)` o `backspace()`, THE valor en `inputs[activeInput]` SHALL ser idéntico al valor que RHF tiene para ese campo tras la invocación de la `SyncCallback`.
3. THE `KeyboardStore` SHALL inicializar `inputs[field.name]` con el valor actual de RHF cada vez que `registerInput` es llamado, para evitar divergencias al montar el componente.

---

### Requirement 9: Visualización del valor del input activo en el teclado virtual

**User Story:** Como usuario final, quiero ver el valor actual del campo que estoy editando en la parte superior del teclado virtual, para tener contexto de lo que he escrito sin necesidad de mirar el campo del formulario.

#### Acceptance Criteria

1. WHILE el `KeyboardQwerty` está visible y `activeInput` no es `null`, THE `KeyboardQwerty` SHALL renderizar un área de visualización en su parte superior que muestre exactamente el string `inputs[activeInput]` del `KeyboardStore`.
2. WHEN el usuario presiona una tecla alfanumérica, de símbolo o backspace en el `KeyboardQwerty`, THE área de visualización SHALL actualizarse de forma síncrona en el mismo ciclo de render para reflejar el nuevo valor de `inputs[activeInput]` sin retraso perceptible.
3. WHILE `activeInput` es `null`, THE `KeyboardQwerty` SHALL mostrar en el área de visualización un texto placeholder (p. ej. `"Selecciona un campo"`) con estilos de color atenuado (`text-muted-foreground` o equivalente) que lo distingan visualmente del valor real.
4. WHILE `activeInput` no es `null` y `inputs[activeInput]` es una cadena vacía (`''`), THE `KeyboardQwerty` SHALL mostrar en el área de visualización un texto placeholder (p. ej. `"Escribe algo..."`) con estilos de color atenuado que lo distingan visualmente del valor real.
5. THE área de visualización SHALL tener `pointer-events: none` (o equivalente) para que no sea interactiva, y SHALL estar separada visualmente de las filas de teclas mediante un borde inferior o espaciado suficiente para que el usuario no la confunda con una tecla.
6. IF el `KeyboardQwerty` se abre con un campo cuyo `inputs[activeInput]` ya contiene un valor no vacío, THEN THE área de visualización SHALL mostrar ese valor preexistente en el primer render visible del teclado, sin necesidad de que el usuario presione ninguna tecla.
7. WHEN el usuario cambia el `activeInput` a un campo diferente mientras el teclado está abierto, THE área de visualización SHALL actualizarse inmediatamente para mostrar el valor de `inputs[nuevoActiveInput]`, o el placeholder correspondiente si ese valor es vacío.
