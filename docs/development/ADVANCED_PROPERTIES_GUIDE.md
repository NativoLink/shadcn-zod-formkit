# 🎯 Advanced Properties Guide - Form Builder

## 🆕 Nueva Funcionalidad

El panel de propiedades ahora tiene **3 tabs** con propiedades clasificadas por tipo de input y soporte completo para dependencias entre campos.

---

## 📑 Estructura de Tabs

### 1. 🎨 Basic Tab
Propiedades fundamentales que aplican a todos los campos:
- Name (identificador único)
- Label (etiqueta visible)
- Placeholder
- Description
- Default Value
- Required / Disabled / Hidden

### 2. ⚙️ Advanced Tab
Propiedades específicas según el tipo de input + propiedades de estilo:
- **Input-Specific Properties** (dinámicas según tipo)
- **Styling & Layout** (CSS, tooltips, help text)

### 3. 🔄 Behavior Tab
Comportamiento dinámico y validaciones:
- **Conditional Display** (dependencias entre campos)
- **Validation** (timing y feedback)
- **Performance** (debounce)
- **Accessibility** (ARIA attributes)

---

## 🎯 Propiedades por Tipo de Input

### 📝 TEXT / TEXT_GROUP / TEXTAREA
```typescript
{
  maxLength: number           // Máximo de caracteres
  showCharCount: boolean      // Mostrar contador "50/100"
  clearable: boolean          // Botón X para limpiar
  copyable: boolean           // Botón para copiar valor
}
```

**Casos de uso:**
- Username con límite de 20 caracteres
- Bio con contador visible
- API Key con botón de copiar

### 🔢 NUMBER
```typescript
{
  min: number                 // Valor mínimo
  max: number                 // Valor máximo
  step: number                // Incremento (ej: 0.5, 10)
}
```

**Casos de uso:**
- Edad (min: 18, max: 100)
- Precio (step: 0.01)
- Cantidad (min: 1, step: 1)

### ⭐ RATING
```typescript
{
  max: number                 // Número de estrellas (1-10)
  showValue: boolean          // Mostrar valor numérico
  allowHalf: boolean          // Permitir medias estrellas
  size: 'sm' | 'md' | 'lg'   // Tamaño de las estrellas
}
```

**Casos de uso:**
- Calificación de producto (max: 5)
- Nivel de satisfacción (max: 10, showValue: true)
- Rating con precisión (allowHalf: true)

### 📱 PHONE
```typescript
{
  defaultCountryCode: string  // Código de país por defecto (ej: "+1")
}
```

**Casos de uso:**
- Teléfono USA (defaultCountryCode: "+1")
- Teléfono México (defaultCountryCode: "+52")
- Teléfono España (defaultCountryCode: "+34")

### 🔒 PASSWORD
```typescript
{
  showStrength: boolean       // Indicador de fortaleza
  showRequirements: boolean   // Lista de requisitos
}
```

**Casos de uso:**
- Registro con validación visual
- Cambio de contraseña con requisitos
- Password seguro con feedback

### 🔗 URL
```typescript
{
  showPreview: boolean        // Mostrar preview del link
  autoProtocol: boolean       // Agregar https:// automáticamente
}
```

**Casos de uso:**
- Website personal con preview
- Link de redes sociales
- URL de API

### 🎯 SLIDER
```typescript
{
  min: number                 // Valor mínimo
  max: number                 // Valor máximo
  step: number                // Incremento
}
```

**Casos de uso:**
- Volumen (min: 0, max: 100, step: 1)
- Precio range (min: 0, max: 1000, step: 10)
- Porcentaje (min: 0, max: 100, step: 5)

### 📁 FILE / FILE_MULTI_UPLOAD
```typescript
{
  fileConfig: {
    accept: string            // Tipos permitidos (ej: "image/*,.pdf")
    maxSize: number           // Tamaño máximo en bytes
    showPreview: boolean      // Mostrar preview de imagen
    multiple: boolean         // Múltiples archivos
  }
}
```

**Casos de uso:**
- Avatar (accept: "image/*", maxSize: 2MB)
- Documentos (accept: ".pdf,.doc,.docx")
- Galería (multiple: true, accept: "image/*")

---

## 🔄 Dependencias Entre Campos

### ¿Qué son las dependencias?

Permiten que un campo dependa del valor de otro campo. Útil para:
- Mostrar/ocultar campos condicionalmente
- Cargar opciones dinámicamente
- Validaciones condicionales

### Cómo Configurar

1. **Selecciona el campo dependiente**
2. **Ve al tab "Behavior"**
3. **En "Depends On Field", selecciona el campo padre**
4. **El campo ahora depende del valor del padre**

### Ejemplo 1: País → Ciudad

```typescript
// Campo: country
{
  name: "country",
  label: "Country",
  inputType: InputTypes.SELECT
}

// Campo: city (depende de country)
{
  name: "city",
  label: "City",
  inputType: InputTypes.SELECT,
  dependsOn: "country",  // ← Configurado en el builder
  loadOptions: async (countryValue) => {
    // Cargar ciudades según el país
    return fetchCities(countryValue);
  }
}
```

**Flujo:**
1. Usuario selecciona "USA" en country
2. Campo city se actualiza con ciudades de USA
3. Usuario selecciona "Mexico" en country
4. Campo city se actualiza con ciudades de México

### Ejemplo 2: Tipo de Usuario → Campos Específicos

```typescript
// Campo: userType
{
  name: "userType",
  label: "User Type",
  inputType: InputTypes.SELECT,
  // opciones: "student", "teacher", "admin"
}

// Campo: studentId (solo para estudiantes)
{
  name: "studentId",
  label: "Student ID",
  inputType: InputTypes.TEXT,
  dependsOn: "userType",
  showWhen: (values) => values.userType === "student"
}

// Campo: teacherCode (solo para profesores)
{
  name: "teacherCode",
  label: "Teacher Code",
  inputType: InputTypes.TEXT,
  dependsOn: "userType",
  showWhen: (values) => values.userType === "teacher"
}
```

**Flujo:**
1. Usuario selecciona "student"
2. Aparece campo studentId
3. Campo teacherCode permanece oculto

### Ejemplo 3: Checkbox → Detalles

```typescript
// Campo: hasExperience
{
  name: "hasExperience",
  label: "Do you have experience?",
  inputType: InputTypes.CHECKBOX
}

// Campo: experienceYears (solo si tiene experiencia)
{
  name: "experienceYears",
  label: "Years of Experience",
  inputType: InputTypes.NUMBER,
  dependsOn: "hasExperience",
  showWhen: (values) => values.hasExperience === true,
  min: 1,
  max: 50
}
```

---

## 🎨 Propiedades de Estilo

### CSS Class Name
```typescript
className: "custom-input border-blue-500"
```

### Wrap in Card
```typescript
wrapInCard: true  // Envuelve el campo en una tarjeta
```

### Info Tooltip
```typescript
infoTooltip: "This is a helpful tooltip"
```

### Help Text
```typescript
helpText: "Detailed explanation that can be expanded"
```

### Help Link
```typescript
helpLink: "https://docs.example.com/field-help"
```

---

## ✅ Validación Avanzada

### Validate on Blur
```typescript
validateOnBlur: true  // Valida cuando el campo pierde foco
```

### Validate on Change
```typescript
validateOnChange: true  // Valida en cada tecla presionada
```

### Show Valid Icon
```typescript
showValidIcon: true  // Muestra ✓ cuando el campo es válido
```

### Async Validation
```typescript
asyncValidation: async (value) => {
  const exists = await checkUsernameExists(value);
  return exists ? "Username already taken" : true;
}
```

---

## ⚡ Performance

### Debounce
```typescript
debounce: 300  // Espera 300ms antes de ejecutar onChange
```

**Casos de uso:**
- Búsqueda en tiempo real
- Autocompletado
- Validación costosa

### Validation Debounce
```typescript
debounceValidation: 500  // Espera 500ms antes de validar
```

**Casos de uso:**
- Validación asíncrona (API calls)
- Verificación de disponibilidad
- Validaciones complejas

---

## ♿ Accesibilidad

### ARIA Label
```typescript
ariaLabel: "User email address"
```

### ARIA Described By
```typescript
ariaDescribedBy: "email-help-text"
```

### ARIA Required
```typescript
ariaRequired: true
```

---

## 🎯 Casos de Uso Complejos

### Caso 1: Formulario de Registro Dinámico

```typescript
// 1. Tipo de cuenta
{
  name: "accountType",
  inputType: InputTypes.SELECT,
  // opciones: "personal", "business"
}

// 2. Nombre (siempre visible)
{
  name: "name",
  inputType: InputTypes.TEXT,
  required: true
}

// 3. Nombre de empresa (solo para business)
{
  name: "companyName",
  inputType: InputTypes.TEXT,
  dependsOn: "accountType",
  showWhen: (values) => values.accountType === "business",
  required: true
}

// 4. Tax ID (solo para business)
{
  name: "taxId",
  inputType: InputTypes.TEXT,
  dependsOn: "accountType",
  showWhen: (values) => values.accountType === "business"
}
```

### Caso 2: Formulario de Dirección con Dependencias

```typescript
// 1. País
{
  name: "country",
  inputType: InputTypes.SELECT
}

// 2. Estado/Provincia (depende de país)
{
  name: "state",
  inputType: InputTypes.SELECT,
  dependsOn: "country",
  loadOptions: async (country) => fetchStates(country)
}

// 3. Ciudad (depende de estado)
{
  name: "city",
  inputType: InputTypes.SELECT,
  dependsOn: "state",
  loadOptions: async (state) => fetchCities(state)
}

// 4. Código postal
{
  name: "zipCode",
  inputType: InputTypes.TEXT,
  dependsOn: "country",
  // Validación diferente según país
}
```

### Caso 3: Formulario de Producto con Variantes

```typescript
// 1. Categoría
{
  name: "category",
  inputType: InputTypes.SELECT
}

// 2. Subcategoría (depende de categoría)
{
  name: "subcategory",
  inputType: InputTypes.SELECT,
  dependsOn: "category",
  loadOptions: async (category) => fetchSubcategories(category)
}

// 3. Tiene variantes
{
  name: "hasVariants",
  inputType: InputTypes.CHECKBOX
}

// 4. Tipo de variante (solo si tiene variantes)
{
  name: "variantType",
  inputType: InputTypes.SELECT,
  dependsOn: "hasVariants",
  showWhen: (values) => values.hasVariants === true
  // opciones: "size", "color", "material"
}
```

---

## 💡 Tips y Mejores Prácticas

### 1. Organización de Propiedades
- **Basic**: Propiedades esenciales que siempre necesitas configurar
- **Advanced**: Propiedades específicas del tipo de input
- **Behavior**: Lógica condicional y validaciones

### 2. Dependencias
- Usa `dependsOn` para indicar la relación
- Usa `showWhen` para mostrar/ocultar condicionalmente
- Usa `loadOptions` para cargar datos dinámicamente

### 3. Validación
- `validateOnBlur` para mejor UX (no molesta mientras escribe)
- `validateOnChange` para feedback inmediato (campos críticos)
- `debounceValidation` para validaciones asíncronas

### 4. Performance
- Usa `debounce` en campos de búsqueda
- Usa `debounceValidation` en validaciones costosas
- Evita validaciones síncronas pesadas

### 5. Accesibilidad
- Siempre configura `ariaLabel` para screen readers
- Usa `ariaRequired` en campos obligatorios
- Proporciona `helpText` descriptivo

---

## 🚀 Cómo Probar

### 1. Propiedades Básicas
1. Selecciona un campo
2. Ve al tab "Basic"
3. Modifica name, label, placeholder
4. Cambia a Preview para ver los cambios

### 2. Propiedades Avanzadas
1. Selecciona un campo (ej: Rating)
2. Ve al tab "Advanced"
3. Verás propiedades específicas de Rating
4. Modifica max stars, showValue, etc.
5. Preview para ver el resultado

### 3. Dependencias
1. Agrega dos campos (ej: Country y City)
2. Selecciona City
3. Ve al tab "Behavior"
4. En "Depends On Field", selecciona Country
5. Preview y prueba la dependencia

---

## 📊 Resumen de Mejoras

### Antes
- Solo propiedades básicas
- Sin clasificación por tipo
- Sin soporte para dependencias
- 2 tabs (Basic, Advanced)

### Ahora
- ✅ 3 tabs organizados
- ✅ Propiedades clasificadas por tipo de input
- ✅ Soporte completo para dependencias
- ✅ 50+ propiedades configurables
- ✅ Validación avanzada
- ✅ Performance tuning
- ✅ Accesibilidad completa

---

**¡Explora todas las posibilidades del Form Builder! 🎨**
