# Requirements Document

## Introduction

Esta feature agrega nuevas propiedades de configuración al input de tipo `NUMBER` en el form builder `shadcn-zod-formkit`. Actualmente el input NUMBER delega su renderizado al componente `FieldTextGroup` sin ningún formato especial. La mejora introduce soporte para formato numérico personalizado (`numberFormat`), control de negativos (`allowNegative`) y control de decimales (`allowDecimals`), permitiendo casos de uso como montos, porcentajes, cantidades con unidades, etc., sin necesidad de usar el input `CURRENCY`.

## Glossary

- **NumberInput**: El componente de formulario que renderiza un campo de tipo número.
- **NumberFormatConfig**: Objeto de configuración que define cómo se formatea visualmente el valor numérico.
- **decimalPlaces**: Cantidad de dígitos permitidos después del separador decimal.
- **thousandsSeparator**: Carácter usado para separar grupos de miles (ej. `','`).
- **decimalSeparator**: Carácter usado como separador decimal (ej. `'.'`).
- **prefix**: Texto o símbolo que se muestra antes del valor (ej. `'$'`).
- **suffix**: Texto o símbolo que se muestra después del valor (ej. `'USD'`).
- **allowNegative**: Propiedad booleana que controla si el campo acepta valores negativos.
- **allowDecimals**: Propiedad booleana que controla si el campo acepta valores decimales.
- **FieldProps**: Interfaz TypeScript que define todas las propiedades configurables de un campo del formulario.
- **FormBuilder**: El sistema completo de construcción de formularios dinámicos de la librería.
- **RawValue**: El valor numérico interno almacenado en React Hook Form (sin formato visual).
- **DisplayValue**: El valor formateado que se muestra al usuario en el input.

---

## Requirements

### Requirement 1: Configuración de formato numérico

**User Story:** Como desarrollador, quiero configurar el formato visual de un campo numérico mediante una propiedad `numberFormat`, para que los usuarios vean los valores con separadores de miles, decimales, prefijos y sufijos apropiados al contexto del negocio.

#### Acceptance Criteria

1. THE `FieldProps` SHALL incluir una propiedad opcional `numberFormat` de tipo `NumberFormatConfig`.
2. WHEN `numberFormat.thousandsSeparator` está definido, THE `NumberInput` SHALL mostrar el separador de miles en el `DisplayValue` mientras el campo no está en foco.
3. WHEN `numberFormat.decimalSeparator` está definido, THE `NumberInput` SHALL usar ese carácter como separador decimal en el `DisplayValue`.
4. WHEN `numberFormat.decimalPlaces` está definido, THE `NumberInput` SHALL redondear y mostrar exactamente esa cantidad de dígitos decimales en el `DisplayValue` al perder el foco.
5. WHEN `numberFormat.prefix` está definido, THE `NumberInput` SHALL mostrar el prefijo como un addon visual a la izquierda del campo.
6. WHEN `numberFormat.suffix` está definido, THE `NumberInput` SHALL mostrar el sufijo como un addon visual a la derecha del campo.
7. THE `NumberInput` SHALL almacenar en React Hook Form el `RawValue` numérico, no el `DisplayValue` formateado.
8. WHEN el campo recibe el foco, THE `NumberInput` SHALL mostrar el `RawValue` sin formato para facilitar la edición.
9. WHEN el campo pierde el foco, THE `NumberInput` SHALL aplicar el formato definido en `numberFormat` al `DisplayValue`.

---

### Requirement 2: Control de valores negativos

**User Story:** Como desarrollador, quiero controlar si un campo numérico acepta valores negativos mediante la propiedad `allowNegative`, para evitar que el usuario ingrese montos o cantidades inválidas según el contexto.

#### Acceptance Criteria

1. THE `FieldProps` SHALL incluir una propiedad opcional `allowNegative` de tipo `boolean`, con valor por defecto `true`.
2. WHEN `allowNegative` es `false` y el usuario intenta ingresar el carácter `'-'`, THE `NumberInput` SHALL ignorar la tecla y no modificar el valor.
3. WHEN `allowNegative` es `false` y el `RawValue` resultante de una operación es negativo, THE `NumberInput` SHALL reemplazarlo por `0`.
4. WHEN `allowNegative` es `true`, THE `NumberInput` SHALL permitir que el usuario ingrese y almacene valores negativos.

---

### Requirement 3: Control de valores decimales

**User Story:** Como desarrollador, quiero controlar si un campo numérico acepta decimales mediante la propiedad `allowDecimals`, para restringir la entrada a números enteros cuando el contexto lo requiera (ej. cantidad de unidades).

#### Acceptance Criteria

1. THE `FieldProps` SHALL incluir una propiedad opcional `allowDecimals` de tipo `boolean`, con valor por defecto `true`.
2. WHEN `allowDecimals` es `false` y el usuario intenta ingresar el separador decimal, THE `NumberInput` SHALL ignorar la tecla y no modificar el valor.
3. WHEN `allowDecimals` es `false`, THE `NumberInput` SHALL almacenar y mostrar únicamente la parte entera del valor.
4. WHEN `allowDecimals` es `true`, THE `NumberInput` SHALL permitir que el usuario ingrese y almacene valores con decimales.
5. WHEN `allowDecimals` es `false` y `numberFormat.decimalPlaces` está definido, THE `NumberInput` SHALL ignorar `decimalPlaces` y tratar el valor como entero.

---

### Requirement 4: Compatibilidad con el sistema de validación existente

**User Story:** Como desarrollador, quiero que las nuevas propiedades del input NUMBER sean compatibles con el sistema de validación Zod existente, para que las reglas de validación sigan funcionando correctamente con los nuevos formatos.

#### Acceptance Criteria

1. THE `NumberInput` SHALL pasar el `RawValue` numérico (no el `DisplayValue`) al resolver de Zod para validación.
2. WHEN `allowNegative` es `false` y el esquema Zod define `z.number().min(0)`, THE `NumberInput` SHALL mostrar el error de validación de Zod sin conflicto con la restricción de `allowNegative`.
3. WHEN `allowDecimals` es `false` y el esquema Zod define `z.number().int()`, THE `NumberInput` SHALL comportarse de forma consistente con esa restricción.
4. THE `NumberInput` SHALL invocar el callback `onChange` de `FieldProps` con el `RawValue` numérico, no con el `DisplayValue`.

---

### Requirement 5: Definición del tipo `NumberFormatConfig`

**User Story:** Como desarrollador, quiero que `NumberFormatConfig` sea un tipo TypeScript bien definido y exportado, para poder usarlo con autocompletado y verificación de tipos en mi IDE.

#### Acceptance Criteria

1. THE `FormBuilder` SHALL exportar el tipo `NumberFormatConfig` desde el punto de entrada principal de la librería.
2. THE `NumberFormatConfig` SHALL definir las propiedades: `decimalPlaces?: number`, `thousandsSeparator?: string`, `decimalSeparator?: string`, `prefix?: string`, `suffix?: string`.
3. WHEN `decimalSeparator` y `thousandsSeparator` tienen el mismo valor, THE `NumberInput` SHALL lanzar un error de consola indicando la configuración inválida y usar los valores por defecto (`'.'` y `','` respectivamente).
4. THE `NumberFormatConfig` SHALL ser una interfaz independiente de `Intl.NumberFormatOptions` para mantener una API simple y predecible.

---

### Requirement 6: Retrocompatibilidad

**User Story:** Como desarrollador que ya usa el input NUMBER sin las nuevas propiedades, quiero que mi código existente siga funcionando sin cambios, para no tener que migrar formularios existentes.

#### Acceptance Criteria

1. WHEN `numberFormat` no está definido en `FieldProps`, THE `NumberInput` SHALL comportarse exactamente igual que en la versión anterior (sin formato especial).
2. WHEN `allowNegative` no está definido, THE `NumberInput` SHALL permitir valores negativos (comportamiento por defecto actual).
3. WHEN `allowDecimals` no está definido, THE `NumberInput` SHALL permitir valores decimales (comportamiento por defecto actual).
4. THE `NumberInput` SHALL mantener compatibilidad con la propiedad `min` y `max` existentes en `FieldProps`.
