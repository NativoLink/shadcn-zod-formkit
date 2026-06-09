# Documento de Requisitos

## Introducción

Esta funcionalidad mejora `FormFieldsGrid` para garantizar que la prop `showWhen` se evalúe de forma reactiva y consistente frente a cambios en los valores del formulario, eliminando el riesgo de evaluar valores obsoletos cuando React agrupa o difiere renders. Adicionalmente, incorpora el soporte de la prop `hidden` como mecanismo estático de ocultamiento, que actualmente está definida en `FieldProps` pero no se aplica en `FormFieldsGrid`.

La solución utiliza `useWatch` de `react-hook-form` para suscribir el componente a los cambios de forma granular y determinista, en lugar de depender de `form.watch()` en el cuerpo del componente.

---

## Glosario

- **FormFieldsGrid**: Componente React que renderiza una cuadrícula de campos de formulario a partir de un array `FieldConfig`.
- **FieldProps**: Interfaz TypeScript que define la configuración de un campo individual del formulario.
- **showWhen**: Prop de `FieldProps` de tipo `(values: Record<string, any>) => boolean`. Determina de forma dinámica si un campo debe mostrarse en función de los valores actuales del formulario.
- **hidden**: Prop de `FieldProps` de tipo `boolean`. Indica de forma estática si un campo debe ocultarse siempre, sin depender del estado del formulario.
- **useWatch**: Hook de `react-hook-form` que suscribe un componente a cambios de valores del formulario de forma reactiva y síncrona.
- **form.watch()**: Método de `UseFormReturn` que obtiene los valores del formulario; sin nombre de campo, suscribe al componente a todos los cambios, pero la actualización depende del ciclo de reconciliación de React.
- **Campo visible**: Campo cuya evaluación de `shouldShowField` retorna `true`.
- **Campo oculto**: Campo cuya evaluación de `shouldShowField` retorna `false`, o cuya prop `hidden` es `true`.
- **shouldShowField**: Función interna de `FormFieldsGrid` que decide si un campo debe renderizarse.
- **Grupo de campos**: Array de `FieldProps` dentro de `FieldConfig`, renderizado como fila horizontal.
- **Render obsoleto**: Render que evalúa `showWhen` con valores que no corresponden al estado actual del formulario por batching o deferred rendering.

---

## Requisitos

### Requisito 1: Suscripción reactiva a los valores del formulario

**User Story:** Como desarrollador de la librería, quiero que `FormFieldsGrid` se suscriba a los valores del formulario mediante `useWatch`, para que `showWhen` siempre se evalúe con los valores más recientes y sin riesgo de renders obsoletos.

#### Criterios de Aceptación

1. THE `FormFieldsGrid` SHALL utilizar `useWatch` del paquete `react-hook-form` para obtener los valores del formulario en lugar de `form.watch()` sin argumentos.
2. WHEN los valores del formulario cambian, THE `FormFieldsGrid` SHALL re-renderizarse de forma síncrona con los valores actualizados antes de evaluar `showWhen`.
3. THE `FormFieldsGrid` SHALL pasar a `shouldShowField` los valores obtenidos mediante `useWatch` en cada evaluación.

---

### Requisito 2: Evaluación de `showWhen` con valores consistentes

**User Story:** Como desarrollador consumidor de la librería, quiero que `showWhen` reciba siempre los valores actuales del formulario al momento de la evaluación, para que la visibilidad de los campos sea coherente con el estado real del formulario.

#### Criterios de Aceptación

1. WHEN `showWhen` es una función definida en `FieldProps`, THE `shouldShowField` SHALL invocarla con los valores actuales del formulario obtenidos reactivamente.
2. IF la invocación de `showWhen` lanza una excepción, THEN THE `shouldShowField` SHALL retornar `true` como comportamiento de fallback, preservando la visibilidad del campo.
3. WHEN `showWhen` no está definida en `FieldProps`, THE `shouldShowField` SHALL retornar `true` por defecto.
4. WHEN los valores del formulario cambian y un campo tiene `showWhen` definido, THE `FormFieldsGrid` SHALL re-evaluar la visibilidad del campo en el mismo ciclo de render que originó el cambio.

---

### Requisito 3: Soporte de la prop `hidden` como mecanismo estático de ocultamiento

**User Story:** Como desarrollador consumidor de la librería, quiero poder ocultar un campo de forma estática mediante la prop `hidden: true`, para que el campo no se renderice independientemente de los valores del formulario.

#### Criterios de Aceptación

1. WHEN la prop `hidden` de un `FieldProps` es `true`, THE `shouldShowField` SHALL retornar `false` sin evaluar `showWhen`.
2. WHEN la prop `hidden` de un `FieldProps` es `false` o `undefined`, THE `shouldShowField` SHALL continuar con la evaluación de `showWhen` si está definida.
3. THE `shouldShowField` SHALL evaluar `hidden` antes de evaluar `showWhen`, aplicando cortocircuito en la evaluación cuando `hidden` es `true`.

---

### Requisito 4: Ocultamiento de grupos de campos

**User Story:** Como desarrollador consumidor de la librería, quiero que los grupos de campos (arrays en `FieldConfig`) respeten las props `hidden` y `showWhen` de cada campo individual, para que la fila del grupo se oculte completamente cuando todos sus campos están ocultos.

#### Criterios de Aceptación

1. WHEN todos los campos de un grupo tienen visibilidad `false` (por `hidden` o `showWhen`), THE `FormFieldsGrid` SHALL no renderizar el contenedor de fila de ese grupo.
2. WHEN al menos un campo de un grupo tiene visibilidad `true`, THE `FormFieldsGrid` SHALL renderizar únicamente los campos visibles dentro del contenedor de fila.
3. WHEN los valores del formulario cambian y afectan la visibilidad de campos dentro de un grupo, THE `FormFieldsGrid` SHALL re-evaluar la visibilidad de todos los campos del grupo en el mismo ciclo de render.

---

### Requisito 5: Sin regresiones en el comportamiento existente

**User Story:** Como desarrollador de la librería, quiero que el cambio de `form.watch()` a `useWatch` no altere el comportamiento observable existente de `FormFieldsGrid`, para que los consumidores actuales no requieran cambios en su código.

#### Criterios de Aceptación

1. THE `FormFieldsGrid` SHALL mantener la misma interfaz de props `Props<T>` sin modificaciones en nombres, tipos ni valores por defecto.
2. WHEN `showWhen` no está definida en ningún campo, THE `FormFieldsGrid` SHALL renderizar todos los campos del array `fields` de la misma forma que antes del cambio.
3. WHEN la prop `readOnly` es `true`, THE `FormFieldsGrid` SHALL seguir aplicando `disabled: true` a todos los campos, de forma independiente a la lógica de visibilidad.
4. WHEN la prop `isPending` es proporcionada, THE `FormFieldsGrid` SHALL continuar pasando su valor a `InputFactory.create` sin cambios.
