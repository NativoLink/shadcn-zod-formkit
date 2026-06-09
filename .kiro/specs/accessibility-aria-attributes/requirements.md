# Requirements Document

## Introduction

La librería `shadcn-zod-formkit` define en `FieldProps` tres propiedades de accesibilidad (`ariaLabel`, `ariaDescribedBy`, `ariaRequired`) y una propiedad de validación (`required`) que nunca se transmiten al elemento `<input>` subyacente como atributos ARIA del DOM. Adicionalmente, el estado de error de `react-hook-form` no se expone como `aria-invalid`. Esto viola los criterios de conformidad WCAG 2.1 AA 1.3.1, 4.1.2 y 1.3.5, impidiendo que usuarios de tecnologías asistivas (lectores de pantalla, navegación por teclado) identifiquen correctamente los campos, sus descripciones, su carácter obligatorio y sus errores de validación.

El alcance de esta mejora cubre los más de 40 tipos de input registrados en `InputTypes`, no únicamente el componente `TextInputGroup`. La solución debe implementarse de forma centralizada en la capa base para que todos los tipos existentes y futuros hereden el comportamiento automáticamente.

## Glossary

- **FormKit**: La librería `shadcn-zod-formkit` que gestiona la creación dinámica de formularios.
- **FieldProps**: Interfaz TypeScript central que define todas las propiedades configurables de un campo de formulario, incluyendo las propiedades ARIA.
- **InputGroupInput**: Componente React que renderiza el elemento `<input>` HTML dentro de `TextInputGroup`.
- **AriaResolver**: Función o hook utilitario (por crear) que centraliza el cálculo de los atributos ARIA a partir de un `FieldProps` y el `fieldState` de react-hook-form.
- **BaseInput**: Clase abstracta de la que extienden todos los componentes de input de la librería.
- **fieldState**: Objeto de react-hook-form que expone el estado del campo, incluyendo el objeto `error` cuando la validación falla.
- **aria-label**: Atributo HTML que provee una etiqueta de texto accesible para un elemento interactivo cuando no hay una etiqueta visual asociada mediante `<label>`.
- **aria-describedby**: Atributo HTML que referencia el `id` del elemento que describe el campo (p. ej., texto de descripción o ayuda).
- **aria-required**: Atributo HTML que indica a las tecnologías asistivas que el campo es obligatorio.
- **aria-invalid**: Atributo HTML que indica a las tecnologías asistivas que el valor actual del campo no supera la validación.
- **WCAG_2.1_AA**: Estándar internacional de accesibilidad web (Web Content Accessibility Guidelines) en su nivel de conformidad AA, versión 2.1.

## Requirements

### Requisito 1: Aplicar `aria-label` al elemento `<input>`

**User Story:** Como usuario de lector de pantalla, quiero que cada campo del formulario tenga una etiqueta accesible anunciada correctamente, para que pueda identificar el propósito de cada campo sin depender de la posición visual.

#### Acceptance Criteria

1. WHEN `FieldProps.ariaLabel` tiene un valor definido, THE `InputGroupInput` SHALL renderizar el elemento `<input>` con el atributo `aria-label` igual al valor de `FieldProps.ariaLabel`.
2. WHEN `FieldProps.ariaLabel` no está definido y `FieldProps.label` tiene un valor, THE `InputGroupInput` SHALL renderizar el elemento `<input>` con el atributo `aria-label` igual al valor de `FieldProps.label`.
3. WHEN `FieldProps.ariaLabel` no está definido y `FieldProps.label` tampoco está definido, THE `InputGroupInput` SHALL omitir el atributo `aria-label` del elemento `<input>` renderizado.
4. THE `AriaResolver` SHALL derivar el valor final de `aria-label` aplicando la precedencia: `ariaLabel` > `label` > omitido.

---

### Requisito 2: Aplicar `aria-describedby` al elemento `<input>`

**User Story:** Como usuario de lector de pantalla, quiero que el campo anuncie su descripción o texto de ayuda cuando recibe el foco, para que pueda comprender instrucciones adicionales sin necesidad de navegar fuera del campo.

#### Acceptance Criteria

1. WHEN `FieldProps.ariaDescribedBy` tiene un valor definido, THE `InputGroupInput` SHALL renderizar el elemento `<input>` con el atributo `aria-describedby` igual al valor de `FieldProps.ariaDescribedBy`.
2. WHEN `FieldProps.ariaDescribedBy` no está definido y `FieldProps.description` tiene un valor, THE `AriaResolver` SHALL generar un identificador determinista basado en `FieldProps.name` con el formato `{name}-description` y THE `InputGroupInput` SHALL renderizar el atributo `aria-describedby` con ese identificador.
3. WHEN `FieldProps.ariaDescribedBy` no está definido y `FieldProps.description` no tiene un valor, THE `InputGroupInput` SHALL omitir el atributo `aria-describedby` del elemento `<input>` renderizado.
4. WHEN `FieldProps.description` tiene un valor y se genera el identificador automático, THE componente `FormDescription` SHALL renderizarse con el atributo `id` igual al identificador generado, vinculando programáticamente la descripción al campo.

---

### Requisito 3: Aplicar `aria-required` al elemento `<input>`

**User Story:** Como usuario de tecnología asistiva, quiero que los campos obligatorios sean anunciados como requeridos al recibir el foco, para que pueda saber antes de intentar enviar el formulario qué campos son necesarios.

#### Acceptance Criteria

1. WHEN `FieldProps.ariaRequired` es `true`, THE `InputGroupInput` SHALL renderizar el elemento `<input>` con el atributo `aria-required="true"`.
2. WHEN `FieldProps.ariaRequired` no está definido y `FieldProps.required` es `true`, THE `InputGroupInput` SHALL renderizar el elemento `<input>` con el atributo `aria-required="true"`.
3. WHEN tanto `FieldProps.ariaRequired` como `FieldProps.required` son `false` o no están definidos, THE `InputGroupInput` SHALL omitir el atributo `aria-required` del elemento `<input>` renderizado.
4. THE `AriaResolver` SHALL derivar el valor final de `aria-required` aplicando la precedencia: `ariaRequired` > `required` > omitido.

---

### Requisito 4: Aplicar `aria-invalid` basado en el estado de validación

**User Story:** Como usuario de lector de pantalla, quiero que los campos con errores de validación sean anunciados como inválidos en tiempo real, para que pueda corregir los errores sin necesidad de revisar visualmente el formulario.

#### Acceptance Criteria

1. WHEN el `fieldState.error` de react-hook-form para el campo es definido (existe un error de validación), THE `InputGroupInput` SHALL renderizar el elemento `<input>` con el atributo `aria-invalid="true"`.
2. WHEN el `fieldState.error` es `undefined` (no hay error de validación), THE `InputGroupInput` SHALL renderizar el elemento `<input>` con el atributo `aria-invalid="false"`.
3. WHEN el campo nunca ha sido tocado (`fieldState.isTouched` es `false`) y no ha habido intento de envío, THE `AriaResolver` SHALL omitir el atributo `aria-invalid` para no indicar un estado de error prematuro.
4. THE `AriaResolver` SHALL obtener el `fieldState` usando el hook `useFormState` o `form.getFieldState` de react-hook-form, sin introducir estado local adicional.

---

### Requisito 5: Centralización en `AriaResolver`

**User Story:** Como mantenedor de la librería, quiero que la lógica de cálculo ARIA esté centralizada en una única utilidad, para que cualquier corrección o mejora se propague automáticamente a todos los tipos de input sin modificar cada componente individualmente.

#### Acceptance Criteria

1. THE `AriaResolver` SHALL exportarse como una función pura desde un archivo utilitario dentro de `src/components/custom/form/inputs/base/`.
2. THE `AriaResolver` SHALL aceptar como parámetros un objeto `FieldProps` y un `fieldState` de react-hook-form, y SHALL retornar un objeto con las claves `aria-label`, `aria-describedby`, `aria-required` y `aria-invalid`, únicamente con los atributos que correspondan según los requisitos 1 a 4.
3. FOR ALL llamadas a `AriaResolver` con un `FieldProps` dado y un `fieldState` sin error, THE resultado SHALL contener `aria-invalid` omitido o `false`, nunca `true`.
4. FOR ALL llamadas a `AriaResolver` con el mismo `FieldProps` y el mismo `fieldState`, THE resultado SHALL ser idéntico (función pura, sin efectos secundarios).
5. THE `AriaResolver` SHALL incluir pruebas unitarias que verifiquen la precedencia y los casos límite descritos en los requisitos 1 a 4.

---

### Requisito 6: Cobertura de todos los tipos de input registrados

**User Story:** Como desarrollador de formularios, quiero que los atributos ARIA se apliquen de forma consistente en todos los tipos de input disponibles en `InputTypes`, para que la accesibilidad no dependa del tipo de campo que se use.

#### Acceptance Criteria

1. FOR ALL tipos de input definidos en el enum `InputTypes` que rendericen un elemento interactivo nativo (`<input>`, `<select>`, `<textarea>`, `<button>`), THE componente de renderizado SHALL aplicar los atributos ARIA calculados por `AriaResolver`.
2. WHEN un tipo de input compuesto (p. ej., `REPEATER`, `KEY_VALUE`, `TAGS`) contiene campos internos, THE `AriaResolver` SHALL aplicarse a cada campo interno de forma independiente usando su propio `FieldProps`.
3. THE `TextInputGroup` (tipo `TEXT_GROUP`) SHALL usar `AriaResolver` en `InputGroupInput` como implementación de referencia antes de que otros tipos adopten el patrón.
4. WHEN se añade un nuevo tipo de input a `inputMap` en el futuro, THE nuevo componente SHALL aplicar `AriaResolver` como parte de sus requisitos de integración, verificado mediante un test de conformidad.

---

### Requisito 7: Conformidad WCAG 2.1 AA — Criterios afectados

**User Story:** Como responsable de accesibilidad del producto, quiero que la librería cumpla los criterios WCAG 2.1 AA relevantes para formularios, para que las aplicaciones construidas sobre ella sean accesibles por defecto.

#### Acceptance Criteria

1. THE `FormKit` SHALL satisfacer el criterio WCAG 2.1 AA 4.1.2 (Nombre, función, valor) aplicando `aria-label` a todos los controles de formulario que rendericen un elemento interactivo sin un `<label>` visible vinculado mediante `for`/`htmlFor`.
2. THE `FormKit` SHALL satisfacer el criterio WCAG 2.1 AA 1.3.1 (Información y relaciones) vinculando programáticamente la descripción del campo mediante `aria-describedby` cuando `FieldProps.description` esté definido.
3. THE `FormKit` SHALL satisfacer el criterio WCAG 2.1 AA 1.3.5 (Identificación del propósito de entrada) mediante la propagación del atributo `aria-required` cuando el campo sea obligatorio.
4. IF un campo tiene error de validación y el atributo `aria-invalid` es `true`, THEN THE `FormMessage` SHALL ser referenciado por `aria-errormessage` o incluido en la región `aria-describedby` del campo, de modo que el mensaje de error sea anunciado por el lector de pantalla.
5. THE `FormKit` SHALL garantizar que ningún input renderizado tenga simultáneamente `aria-label` vacío (`""`) y ausencia de `<label>` visible asociado, ya que esto resultaría en un campo sin nombre accesible.
