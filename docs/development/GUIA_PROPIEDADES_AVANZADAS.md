# 🎯 Guía de Propiedades Avanzadas

## 🆕 ¿Qué hay de nuevo?

El panel de propiedades ahora tiene **3 pestañas** con más de 50 propiedades organizadas y soporte para dependencias entre campos.

---

## 📑 Las 3 Pestañas

### 1. 🎨 Basic (Básico)
Lo esencial que todo campo necesita:
- Nombre del campo
- Etiqueta visible
- Placeholder
- Descripción
- Valor por defecto
- Requerido / Deshabilitado / Oculto

### 2. ⚙️ Advanced (Avanzado)
Propiedades específicas según el tipo de input:
- **Propiedades del Input**: Cambian según el tipo
- **Estilo y Diseño**: CSS, tooltips, ayuda

### 3. 🔄 Behavior (Comportamiento)
Lógica dinámica:
- **Dependencias**: Un campo depende de otro
- **Validación**: Cuándo y cómo validar
- **Performance**: Optimizaciones
- **Accesibilidad**: ARIA attributes

---

## 🎯 Ejemplos Prácticos

### Ejemplo 1: Campo de Username con Límite

**Configuración:**
```
Tab Basic:
- Name: username
- Label: Nombre de Usuario
- Placeholder: Elige un nombre único
- Required: ✓

Tab Advanced:
- Max Length: 20
- Show Character Count: ✓
- Clearable: ✓
```

**Resultado:**
- Usuario ve "15/20" mientras escribe
- Botón X para limpiar
- No puede escribir más de 20 caracteres

### Ejemplo 2: Calificación de Producto

**Configuración:**
```
Tab Basic:
- Name: rating
- Label: Califica este producto
- Required: ✓

Tab Advanced:
- Max Stars: 5
- Show Value: ✓
- Allow Half: ✓
- Size: lg
```

**Resultado:**
- 5 estrellas grandes
- Permite medias estrellas (4.5)
- Muestra el número al lado

### Ejemplo 3: Contraseña Segura

**Configuración:**
```
Tab Basic:
- Name: password
- Label: Contraseña
- Required: ✓

Tab Advanced:
- Show Strength: ✓
- Show Requirements: ✓

Tab Behavior:
- Validate on Change: ✓
```

**Resultado:**
- Barra de fortaleza (débil/media/fuerte)
- Lista de requisitos visible
- Valida mientras escribes

---

## 🔄 Dependencias Entre Campos

### ¿Para qué sirven?

Imagina que tienes un formulario de dirección:
1. Usuario selecciona **País**
2. El campo **Estado** se llena con estados de ese país
3. Usuario selecciona **Estado**
4. El campo **Ciudad** se llena con ciudades de ese estado

¡Eso son dependencias!

### Cómo Configurar Dependencias

#### Paso 1: Crea los campos
```
Campo 1: country (País)
Campo 2: state (Estado)
Campo 3: city (Ciudad)
```

#### Paso 2: Configura la dependencia
```
Selecciona el campo "state"
→ Tab Behavior
→ Depends On Field: country
```

```
Selecciona el campo "city"
→ Tab Behavior
→ Depends On Field: state
```

#### Paso 3: Prueba en Preview
1. Selecciona un país
2. Ve cómo el campo estado se actualiza
3. Selecciona un estado
4. Ve cómo el campo ciudad se actualiza

---

## 💡 Casos de Uso Reales

### Caso 1: Formulario de Registro

**Escenario:** Registro diferente para estudiantes y profesores

```
1. Campo: userType (Tipo de Usuario)
   - Opciones: "Estudiante", "Profesor"

2. Campo: studentId (ID de Estudiante)
   - Depends On: userType
   - Solo visible si userType = "Estudiante"

3. Campo: teacherCode (Código de Profesor)
   - Depends On: userType
   - Solo visible si userType = "Profesor"
```

**Flujo:**
- Usuario selecciona "Estudiante" → Aparece campo studentId
- Usuario selecciona "Profesor" → Aparece campo teacherCode

### Caso 2: Formulario de Producto

**Escenario:** Producto con o sin variantes

```
1. Campo: hasVariants (¿Tiene variantes?)
   - Tipo: Checkbox

2. Campo: variantType (Tipo de Variante)
   - Depends On: hasVariants
   - Solo visible si hasVariants = true
   - Opciones: "Talla", "Color", "Material"

3. Campo: variants (Variantes)
   - Depends On: hasVariants
   - Solo visible si hasVariants = true
   - Tipo: Repeater
```

**Flujo:**
- Usuario marca "Tiene variantes" → Aparecen campos de variantes
- Usuario desmarca → Campos de variantes desaparecen

### Caso 3: Formulario de Envío

**Escenario:** Dirección de envío diferente a facturación

```
1. Campo: sameAddress (¿Misma dirección?)
   - Tipo: Checkbox
   - Default: true

2. Campo: shippingAddress (Dirección de Envío)
   - Depends On: sameAddress
   - Solo visible si sameAddress = false

3. Campo: shippingCity (Ciudad de Envío)
   - Depends On: sameAddress
   - Solo visible si sameAddress = false
```

---

## 🎨 Propiedades por Tipo de Input

### 📝 Texto (TEXT, TEXT_GROUP, TEXTAREA)

**Propiedades disponibles:**
- `maxLength`: Máximo de caracteres
- `showCharCount`: Mostrar "50/100"
- `clearable`: Botón X para limpiar
- `copyable`: Botón para copiar

**Ejemplo práctico:**
```
API Key:
- maxLength: 64
- copyable: ✓
- clearable: ✓
```

### 🔢 Número (NUMBER)

**Propiedades disponibles:**
- `min`: Valor mínimo
- `max`: Valor máximo
- `step`: Incremento

**Ejemplo práctico:**
```
Edad:
- min: 18
- max: 100
- step: 1

Precio:
- min: 0
- max: 9999.99
- step: 0.01
```

### ⭐ Calificación (RATING)

**Propiedades disponibles:**
- `max`: Número de estrellas (1-10)
- `showValue`: Mostrar número
- `allowHalf`: Permitir medias estrellas
- `size`: Tamaño (sm/md/lg)

**Ejemplo práctico:**
```
Satisfacción del cliente:
- max: 5
- showValue: ✓
- allowHalf: ✓
- size: lg
```

### 📱 Teléfono (PHONE)

**Propiedades disponibles:**
- `defaultCountryCode`: Código de país

**Ejemplo práctico:**
```
Teléfono México:
- defaultCountryCode: "+52"

Teléfono USA:
- defaultCountryCode: "+1"
```

### 🔒 Contraseña (PASSWORD)

**Propiedades disponibles:**
- `showStrength`: Indicador de fortaleza
- `showRequirements`: Lista de requisitos

**Ejemplo práctico:**
```
Nueva contraseña:
- showStrength: ✓
- showRequirements: ✓
- validateOnChange: ✓
```

### 🔗 URL (URL)

**Propiedades disponibles:**
- `showPreview`: Mostrar preview
- `autoProtocol`: Agregar https:// automáticamente

**Ejemplo práctico:**
```
Sitio web:
- showPreview: ✓
- autoProtocol: ✓
```

### 🎯 Slider (SLIDER)

**Propiedades disponibles:**
- `min`: Valor mínimo
- `max`: Valor máximo
- `step`: Incremento

**Ejemplo práctico:**
```
Volumen:
- min: 0
- max: 100
- step: 5

Rango de precio:
- min: 0
- max: 1000
- step: 10
```

### 📁 Archivo (FILE, FILE_MULTI_UPLOAD)

**Propiedades disponibles:**
- `accept`: Tipos permitidos
- `maxSize`: Tamaño máximo (bytes)
- `showPreview`: Mostrar preview
- `multiple`: Múltiples archivos

**Ejemplo práctico:**
```
Avatar:
- accept: "image/*"
- maxSize: 2097152 (2MB)
- showPreview: ✓

Documentos:
- accept: ".pdf,.doc,.docx"
- maxSize: 10485760 (10MB)
- multiple: ✓
```

---

## ⚡ Optimización de Performance

### Debounce

**¿Qué es?**
Espera un tiempo antes de ejecutar una acción.

**¿Cuándo usar?**
- Búsqueda en tiempo real
- Autocompletado
- Validaciones costosas

**Ejemplo:**
```
Campo de búsqueda:
- debounce: 300 (espera 300ms)

Usuario escribe: "h" → "ho" → "hol" → "hola"
Solo busca después de 300ms de inactividad
```

### Validation Debounce

**¿Qué es?**
Espera un tiempo antes de validar.

**¿Cuándo usar?**
- Validación asíncrona (llamadas a API)
- Verificar disponibilidad de username
- Validaciones complejas

**Ejemplo:**
```
Username:
- debounceValidation: 500

Usuario escribe: "john"
Espera 500ms → Verifica si "john" está disponible
```

---

## ✅ Validación Avanzada

### Validate on Blur
Valida cuando el campo pierde el foco.

**Mejor para:** Campos que no necesitan feedback inmediato

### Validate on Change
Valida en cada tecla presionada.

**Mejor para:** Contraseñas, campos críticos

### Show Valid Icon
Muestra ✓ cuando el campo es válido.

**Mejor para:** Formularios largos, feedback visual

---

## ♿ Accesibilidad

### ¿Por qué es importante?
Para que personas con discapacidades puedan usar tu formulario.

### Propiedades disponibles:

**ARIA Label:**
```
ariaLabel: "Correo electrónico del usuario"
```

**ARIA Described By:**
```
ariaDescribedBy: "email-help-text"
```

**ARIA Required:**
```
ariaRequired: true
```

---

## 🚀 Cómo Empezar

### 1. Abre el Form Builder
```bash
cd example
npm run dev
```
Ve a: http://localhost:3000/form-builder

### 2. Agrega un Campo
Arrastra un input al canvas

### 3. Explora las Propiedades
- Tab Basic: Configura lo esencial
- Tab Advanced: Personaliza según el tipo
- Tab Behavior: Agrega lógica dinámica

### 4. Prueba en Preview
Cambia al tab Preview para ver el resultado

---

## 💡 Tips Finales

1. **Empieza simple**: Configura Basic primero
2. **Explora Advanced**: Cada tipo tiene propiedades únicas
3. **Usa dependencias**: Para formularios dinámicos
4. **Prueba en Preview**: Verifica que funcione como esperas
5. **Optimiza**: Usa debounce para mejor performance

---

**¡Ahora tienes un Form Builder súper poderoso! 🎉**
