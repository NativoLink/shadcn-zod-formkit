# Documento de Requisitos

## Introducción

El `keyboard.store.ts` de la librería `shadcn-zod-formkit` gestiona el estado del teclado virtual mediante Zustand. Las acciones `write`, `backspace` y `clear` presentan tres defectos críticos:

1. **Mutación directa de objetos**: `write` y `backspace` modifican las propiedades del objeto `currentInputField` en lugar de crear nuevas referencias, lo que impide que los componentes suscritos detecten el cambio y se vuelvan a renderizar.
2. **`set()` anidado (anti-patrón de Zustand)**: ambas acciones llaman a `set()` dentro del callback de otro `set()`, comportamiento explícitamente desaconsejado por Zustand.
3. **`clear()` incompleto**: la acción `clear` sólo limpia el mapa `inputs` pero no actualiza `currentInputField`, dejando el estado inconsistente.

Este spec cubre los requisitos para corregir las tres deficiencias garantizando inmutabilidad, coherencia de estado y compatibilidad total con `react-hook-form`.

---

## Glosario

- **Store**: Instancia de Zustand creada con `create<KeyboardState>()` en `keyboard.store.ts`.
- **KeyboardState**: Interfaz TypeScript que define la forma del estado y las acciones del Store.
- **currentInputField**: Propiedad del Store de tipo `InputField | null` que representa el campo de formulario actualmente enfocado por el teclado virtual.
- **InputField**: Objeto con las propiedades `input`, `field`, `name`, `onChange` y `getValue`. La propiedad `field` es de tipo `ControllerRenderProps` de `react-hook-form`.
- **inputs**: Mapa `Record<string, string>` del Store que almacena los valores de los campos registrados indexados por su `id`.
- **activeInput**: Propiedad del Store de tipo `string | null` que indica el `id` del campo activo.
- **Acción `write`**: Función del Store que añade un carácter al valor del campo activo.
- **Acción `backspace`**: Función del Store que elimina el último carácter del valor del campo activo.
- **Acción `clear`**: Función del Store que vacía el valor del campo activo.
- **Nueva referencia de objeto**: Nuevo objeto creado mediante spread (`{ ...obj }`) cuya identidad (`===`) es distinta al objeto original, permitiendo que Zustand detecte el cambio de estado.
- **set() anidado**: Llamada a la función `set` de Zustand dentro del callback pasado a otra llamada a `set`. Zustand desaconseja este patrón.

---

## Requisitos

### Requisito 1: Escritura inmutable en el campo activo

**User Story:** Como componente React suscrito al Store, quiero que la acción `write` cree una nueva referencia del objeto `currentInputField` para que Zustand notifique el cambio y el componente se vuelva a renderizar con el valor actualizado.

#### Criterios de Aceptación

1. WHEN la acción `write` es invocada con un carácter y `currentInputField` contiene un `field` válido, THE Store SHALL devolver desde el callback de `set` un objeto `currentInputField` con una nueva referencia de objeto cuya propiedad `field.value` sea igual al valor anterior concatenado con el carácter recibido.
2. WHEN la acción `write` es invocada, THE Store SHALL invocar `currentInputField.field.onChange` con el nuevo valor calculado en el mismo ciclo de actualización, sin llamar a `set()` de forma anidada.
3. WHEN la acción `write` es invocada y `currentInputField` es `null` o `currentInputField.field` es `undefined`, THE Store SHALL actualizar únicamente el mapa `inputs` sin lanzar errores.
4. WHEN la acción `write` es invocada y `activeInput` tiene un valor registrado en `inputs`, THE Store SHALL actualizar el mapa `inputs` con el nuevo valor del campo activo en la misma llamada a `set`.
5. THE Store SHALL ejecutar la acción `write` sin ninguna llamada anidada a la función `set` de Zustand.

---

### Requisito 2: Borrado inmutable de carácter en el campo activo

**User Story:** Como componente React suscrito al Store, quiero que la acción `backspace` cree una nueva referencia del objeto `currentInputField` para que Zustand notifique el cambio y el componente se vuelva a renderizar con el carácter final eliminado.

#### Criterios de Aceptación

1. WHEN la acción `backspace` es invocada y `currentInputField` contiene un `field` con valor no vacío, THE Store SHALL devolver desde el callback de `set` un objeto `currentInputField` con una nueva referencia de objeto cuya propiedad `field.value` sea igual al valor anterior con el último carácter eliminado.
2. WHEN la acción `backspace` es invocada, THE Store SHALL invocar `currentInputField.field.onChange` con el nuevo valor calculado en el mismo ciclo de actualización, sin llamar a `set()` de forma anidada.
3. WHEN la acción `backspace` es invocada y `currentInputField.field.value` es una cadena vacía, THE Store SHALL devolver un `currentInputField` con `field.value` igual a cadena vacía sin lanzar errores.
4. WHEN la acción `backspace` es invocada y `currentInputField` es `null` o `currentInputField.field` es `undefined`, THE Store SHALL actualizar únicamente el mapa `inputs` sin lanzar errores.
5. WHEN la acción `backspace` es invocada y `activeInput` tiene un valor registrado en `inputs`, THE Store SHALL actualizar el mapa `inputs` eliminando el último carácter del valor del campo activo en la misma llamada a `set`.
6. THE Store SHALL ejecutar la acción `backspace` sin ninguna llamada anidada a la función `set` de Zustand.

---

### Requisito 3: Limpieza completa y consistente del campo activo

**User Story:** Como componente React suscrito al Store, quiero que la acción `clear` vacíe tanto `currentInputField.field.value` como la entrada correspondiente en el mapa `inputs` para que el estado del Store sea siempre consistente.

#### Criterios de Aceptación

1. WHEN la acción `clear` es invocada y `currentInputField` contiene un `field` válido, THE Store SHALL devolver desde el callback de `set` un objeto `currentInputField` con una nueva referencia de objeto cuya propiedad `field.value` sea igual a una cadena vacía.
2. WHEN la acción `clear` es invocada y `currentInputField` contiene un `field` válido, THE Store SHALL invocar `currentInputField.field.onChange` con una cadena vacía.
3. WHEN la acción `clear` es invocada y `activeInput` tiene un valor registrado en `inputs`, THE Store SHALL actualizar el mapa `inputs` asignando una cadena vacía al campo activo en la misma llamada a `set`.
4. WHEN la acción `clear` es invocada y `currentInputField` es `null`, THE Store SHALL actualizar únicamente el mapa `inputs` sin lanzar errores.
5. WHEN la acción `clear` es invocada y `activeInput` es `null`, THE Store SHALL actualizar únicamente `currentInputField` sin lanzar errores.

---

### Requisito 4: Consistencia de referencias para la detección de cambios por Zustand

**User Story:** Como desarrollador que integra el teclado virtual, quiero que todas las acciones que modifican `currentInputField` produzcan siempre nuevas referencias de objeto para garantizar que los selectores de Zustand y `React.memo` detecten los cambios correctamente.

#### Criterios de Aceptación

1. THE Store SHALL garantizar que, tras la ejecución de `write`, `backspace` o `clear`, la referencia del objeto `currentInputField` devuelta por el Store sea distinta (`!==`) a la referencia previa a la llamada cuando el campo ha sido modificado.
2. THE Store SHALL garantizar que, tras la ejecución de `write`, `backspace` o `clear`, la referencia del objeto `currentInputField.field` devuelta por el Store sea distinta (`!==`) a la referencia previa cuando el campo ha sido modificado.
3. WHILE el Store está siendo actualizado por `write`, `backspace` o `clear`, THE Store SHALL producir el nuevo estado en una única llamada a `set` sin efectos secundarios de estado adicionales.
