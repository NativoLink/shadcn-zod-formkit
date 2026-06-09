# Documento de Requisitos

## Introducción

Esta funcionalidad corrige la navegación por teclado en el componente `FakeInput` de la librería `shadcn-zod-formkit`. Actualmente, `FakeInput` es un `<div>` con `tabIndex={0}` que intercepta todos los eventos de teclado a través de un listener en `window`, llamando a `e.preventDefault()` de forma incondicional. Esto bloquea la tecla Tab, dejando al usuario atrapado dentro del campo sin poder avanzar al siguiente elemento o retroceder al anterior.

La corrección debe permitir que la tecla Tab (navegación hacia adelante) y la combinación Shift+Tab (navegación hacia atrás) muevan el foco al siguiente o anterior elemento enfocable del DOM, replicando el comportamiento nativo de un `<input>`, incluso cuando el teclado virtual esté abierto.

## Glosario

- **FakeInput**: Componente React basado en `<div>` que simula un campo de entrada de texto usando `tabIndex={0}` y un store Zustand (`useKeyboardStore`) en lugar de un elemento `<input>` nativo.
- **Teclado_Virtual**: Componente de teclado en pantalla gestionado por `useKeyboardStore`, que puede estar abierto o cerrado y escribe caracteres en el campo activo.
- **Elemento_Enfocable**: Elemento del DOM que puede recibir foco mediante Tab, incluyendo `<input>`, `<button>`, `<select>`, `<textarea>`, `<a>` con `href`, y cualquier elemento con `tabIndex >= 0`.
- **Handler_KeyDown**: Función `handleKeyDown` registrada en `window` mediante `useEffect` cuando `isFocused === true` en `FakeInput`.
- **Tab_Forward**: Acción de mover el foco al siguiente `Elemento_Enfocable` en el orden del DOM, equivalente a presionar Tab sin modificadores.
- **Tab_Backward**: Acción de mover el foco al elemento `Elemento_Enfocable` anterior en el orden del DOM, equivalente a presionar Shift+Tab.
- **Orden_de_Foco**: Secuencia de `Elementos_Enfocables` determinada por el atributo `tabIndex` y la posición en el DOM.

---

## Requisitos

### Requisito 1: Navegación Tab hacia adelante

**User Story:** Como usuario de un formulario con campos `FakeInput`, quiero presionar Tab para mover el foco al siguiente campo, para poder completar el formulario sin usar el ratón.

#### Criterios de Aceptación

1. WHEN el usuario presiona la tecla Tab mientras un `FakeInput` tiene el foco, THE `FakeInput` SHALL mover el foco al siguiente `Elemento_Enfocable` en el `Orden_de_Foco` del DOM.
2. WHEN el usuario presiona la tecla Tab mientras un `FakeInput` tiene el foco, THE `Handler_KeyDown` SHALL suprimir la propagación del evento Tab a `window` para evitar comportamiento duplicado.
3. WHEN el usuario presiona la tecla Tab mientras un `FakeInput` tiene el foco y el `Teclado_Virtual` está abierto, THE `FakeInput` SHALL cerrar el `Teclado_Virtual` antes de mover el foco.
4. WHEN el usuario presiona la tecla Tab mientras un `FakeInput` tiene el foco y no existe ningún `Elemento_Enfocable` posterior en el DOM, THE `FakeInput` SHALL mover el foco al primer `Elemento_Enfocable` del formulario.

---

### Requisito 2: Navegación Shift+Tab hacia atrás

**User Story:** Como usuario de un formulario con campos `FakeInput`, quiero presionar Shift+Tab para mover el foco al campo anterior, para poder corregir datos sin usar el ratón.

#### Criterios de Aceptación

1. WHEN el usuario presiona Shift+Tab mientras un `FakeInput` tiene el foco, THE `FakeInput` SHALL mover el foco al `Elemento_Enfocable` anterior en el `Orden_de_Foco` del DOM.
2. WHEN el usuario presiona Shift+Tab mientras un `FakeInput` tiene el foco, THE `Handler_KeyDown` SHALL suprimir la propagación del evento Shift+Tab a `window` para evitar comportamiento duplicado.
3. WHEN el usuario presiona Shift+Tab mientras un `FakeInput` tiene el foco y el `Teclado_Virtual` está abierto, THE `FakeInput` SHALL cerrar el `Teclado_Virtual` antes de mover el foco.
4. WHEN el usuario presiona Shift+Tab mientras un `FakeInput` tiene el foco y no existe ningún `Elemento_Enfocable` anterior en el DOM, THE `FakeInput` SHALL mover el foco al último `Elemento_Enfocable` del formulario.

---

### Requisito 3: No interferencia con otras teclas

**User Story:** Como usuario de un formulario con campos `FakeInput`, quiero que el resto de teclas (caracteres, Backspace, Enter, Escape) sigan funcionando con normalidad después de implementar la navegación Tab, para que la entrada de datos no se vea afectada.

#### Criterios de Aceptación

1. WHEN el usuario presiona una tecla de carácter imprimible (longitud 1) mientras un `FakeInput` tiene el foco, THE `Handler_KeyDown` SHALL invocar `write(e.key)` con el carácter presionado y llamar a `e.preventDefault()` para evitar comportamiento nativo del navegador.
2. WHEN el usuario presiona Backspace mientras un `FakeInput` tiene el foco, THE `Handler_KeyDown` SHALL invocar `backspace()` y llamar a `e.preventDefault()`.
3. WHEN el usuario presiona Escape mientras un `FakeInput` tiene el foco, THE `Handler_KeyDown` SHALL invocar `setIsOpen(false)` para cerrar el `Teclado_Virtual`.
4. WHEN el usuario presiona Enter mientras un `FakeInput` tiene el foco, THE `Handler_KeyDown` SHALL ignorar la tecla sin modificar el valor del campo.
5. THE `FakeInput` SHALL llamar a `e.preventDefault()` únicamente para teclas que requieren supresión del comportamiento nativo del navegador, excluyendo Tab y Shift+Tab.

---

### Requisito 4: Gestión del estado al perder el foco por Tab

**User Story:** Como desarrollador que integra `FakeInput` en un formulario, quiero que el estado interno del componente se actualice correctamente cuando el foco sale por Tab, para evitar inconsistencias entre el store de teclado y el campo activo.

#### Criterios de Aceptación

1. WHEN el foco sale de un `FakeInput` como resultado de la navegación Tab o Shift+Tab, THE `FakeInput` SHALL invocar `handleBlur` para actualizar el estado `isFocused` a `false`.
2. WHEN el foco sale de un `FakeInput` como resultado de la navegación Tab o Shift+Tab, THE `FakeInput` SHALL invocar `setCurrentInputField(null)` para limpiar el campo activo en el `Teclado_Virtual`.
3. WHILE `isFocused` es `false` en un `FakeInput`, THE `FakeInput` SHALL mantener el listener `handleKeyDown` desregistrado de `window`.

---

### Requisito 5: Compatibilidad con el orden de tabulación del DOM

**User Story:** Como desarrollador que compone formularios con una mezcla de campos nativos y `FakeInput`, quiero que la navegación Tab respete el `tabIndex` de cada elemento, para que el orden de foco sea predecible y coherente con el resto del formulario.

#### Criterios de Aceptación

1. THE `FakeInput` SHALL calcular el siguiente o anterior `Elemento_Enfocable` consultando el `tabIndex` y la posición en el DOM de todos los elementos enfocables del documento.
2. WHEN dos `Elementos_Enfocables` tienen el mismo valor de `tabIndex`, THE `FakeInput` SHALL respetar el orden de aparición en el DOM para determinar la secuencia de foco.
3. WHEN un `Elemento_Enfocable` tiene `tabIndex=-1`, THE `FakeInput` SHALL excluirlo del cálculo del siguiente o anterior elemento en la navegación Tab.
4. WHEN un `Elemento_Enfocable` está deshabilitado (`disabled=true`), THE `FakeInput` SHALL excluirlo del cálculo del siguiente o anterior elemento en la navegación Tab.
