# 🔄 Conditional Logic Editor - Guía Completa

## 🎯 ¿Qué es?

El **Conditional Logic Editor** es un editor visual que permite definir cuándo mostrar u ocultar campos basándose en los valores de otros campos, sin necesidad de escribir código.

---

## ✨ Características

### 1. Editor Visual
- Interfaz drag & drop intuitiva
- Sin necesidad de escribir código
- Preview del código generado

### 2. Múltiples Reglas
- Agregar tantas reglas como necesites
- Combinar con AND u OR
- Eliminar reglas fácilmente

### 3. 10 Operadores Disponibles
- **Es igual a**: `field === value`
- **No es igual a**: `field !== value`
- **Contiene**: `field.includes(value)`
- **No contiene**: `!field.includes(value)`
- **Mayor que**: `field > value`
- **Menor que**: `field < value`
- **Mayor o igual que**: `field >= value`
- **Menor o igual que**: `field <= value`
- **Está vacío**: `!field || field === ""`
- **No está vacío**: `field && field !== ""`

### 4. Generación de Código
- Genera función `showWhen` automáticamente
- Código optimizado y limpio
- Compatible con TypeScript

---

## 🚀 Cómo Usar

### Paso 1: Activar el Editor

1. Selecciona un campo en el canvas
2. Ve al tab "Comportamiento"
3. Activa el switch "Lógica Condicional (showWhen)"
4. El editor aparecerá

### Paso 2: Agregar Reglas

1. Haz clic en "Agregar Regla"
2. Selecciona el campo del que depende
3. Selecciona el operador
4. Ingresa el valor (si aplica)

### Paso 3: Configurar Lógica

Si tienes múltiples reglas:
- **Y (AND)**: Todas las reglas deben cumplirse
- **O (OR)**: Al menos una regla debe cumplirse

### Paso 4: Aplicar

1. Haz clic en "Aplicar"
2. Las reglas se guardan automáticamente
3. Ve al tab Preview para probar

---

## 📋 Ejemplos Prácticos

### Ejemplo 1: Mostrar Campo Según Checkbox

**Escenario:** Mostrar campo "Detalles" solo si checkbox "Tiene experiencia" está marcado

**Configuración:**
```
Regla 1:
- Campo: hasExperience
- Operador: Es igual a
- Valor: true
```

**Código generado:**
```typescript
(values) => values.hasExperience === true
```

**Resultado:**
- Usuario marca checkbox → Campo "Detalles" aparece
- Usuario desmarca checkbox → Campo "Detalles" desaparece

---

### Ejemplo 2: Mostrar Campo Según Select

**Escenario:** Mostrar campo "Student ID" solo si tipo de usuario es "student"

**Configuración:**
```
Regla 1:
- Campo: userType
- Operador: Es igual a
- Valor: student
```

**Código generado:**
```typescript
(values) => values.userType === "student"
```

**Resultado:**
- Usuario selecciona "student" → Campo "Student ID" aparece
- Usuario selecciona "teacher" → Campo "Student ID" desaparece

---

### Ejemplo 3: Múltiples Condiciones con AND

**Escenario:** Mostrar campo "Descuento" solo si edad >= 18 Y es estudiante

**Configuración:**
```
Operador lógico: Y (AND)

Regla 1:
- Campo: age
- Operador: Mayor o igual que
- Valor: 18

Regla 2:
- Campo: isStudent
- Operador: Es igual a
- Valor: true
```

**Código generado:**
```typescript
(values) => values.age >= 18 && values.isStudent === true
```

**Resultado:**
- Ambas condiciones deben cumplirse para mostrar el campo

---

### Ejemplo 4: Múltiples Condiciones con OR

**Escenario:** Mostrar campo "Contacto de emergencia" si es menor de edad O tiene condición médica

**Configuración:**
```
Operador lógico: O (OR)

Regla 1:
- Campo: age
- Operador: Menor que
- Valor: 18

Regla 2:
- Campo: hasMedicalCondition
- Operador: Es igual a
- Valor: true
```

**Código generado:**
```typescript
(values) => values.age < 18 || values.hasMedicalCondition === true
```

**Resultado:**
- Si cualquiera de las condiciones se cumple, el campo aparece

---

### Ejemplo 5: Campo Vacío/No Vacío

**Escenario:** Mostrar campo "Otro" solo si campo "Comentarios" no está vacío

**Configuración:**
```
Regla 1:
- Campo: comments
- Operador: No está vacío
- Valor: (no aplica)
```

**Código generado:**
```typescript
(values) => values.comments && values.comments !== ""
```

**Resultado:**
- Usuario escribe algo en "Comentarios" → Campo "Otro" aparece
- Usuario borra todo → Campo "Otro" desaparece

---

### Ejemplo 6: Contiene Texto

**Escenario:** Mostrar campo "Código postal" solo si país contiene "United"

**Configuración:**
```
Regla 1:
- Campo: country
- Operador: Contiene
- Valor: United
```

**Código generado:**
```typescript
(values) => values.country?.toString().includes("United")
```

**Resultado:**
- "United States" → Muestra campo
- "United Kingdom" → Muestra campo
- "Mexico" → No muestra campo

---

## 🎨 Interfaz del Editor

```
┌─────────────────────────────────────────────────┐
│ Editor de Lógica Condicional          [2 reglas]│
│ Define cuándo mostrar este campo                │
├─────────────────────────────────────────────────┤
│                                                  │
│ Operador lógico: [Y (AND) ▼]                   │
│ Todas las reglas deben cumplirse                │
│                                                  │
│ ┌─────────────────────────────────────────────┐ │
│ │ [Regla 1]                              [🗑️] │ │
│ │                                              │ │
│ │ Campo:    [userType ▼]                      │ │
│ │ Operador: [Es igual a ▼]                    │ │
│ │ Valor:    [student_____________]            │ │
│ └─────────────────────────────────────────────┘ │
│                                                  │
│ ┌─────────────────────────────────────────────┐ │
│ │ [Regla 2] Y                            [🗑️] │ │
│ │                                              │ │
│ │ Campo:    [age ▼]                           │ │
│ │ Operador: [Mayor o igual que ▼]            │ │
│ │ Valor:    [18__________________]            │ │
│ └─────────────────────────────────────────────┘ │
│                                                  │
│ [+ Agregar Regla] [Aplicar] [Limpiar] [Código] │
│                                                  │
│ 💡 Tip: Haz clic en "Aplicar" para guardar     │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Funcionalidades Avanzadas

### Ver Código Generado

1. Haz clic en "Ver Código"
2. Se abre un modal con el código
3. Puedes copiarlo para usarlo manualmente

**Ejemplo de código:**
```typescript
showWhen: (values) => values.userType === "student" && values.age >= 18
```

### Limpiar Todo

1. Haz clic en "Limpiar Todo"
2. Todas las reglas se eliminan
3. El campo será siempre visible

### Eliminar Regla Individual

1. Haz clic en el icono 🗑️ de la regla
2. La regla se elimina inmediatamente
3. Las demás reglas se mantienen

---

## 💡 Tips y Mejores Prácticas

### 1. Empieza Simple
- Comienza con una sola regla
- Prueba en Preview
- Agrega más reglas gradualmente

### 2. Usa Nombres Descriptivos
- Nombres de campos claros
- Facilita entender las reglas
- Mejor mantenimiento

### 3. Prueba en Preview
- Siempre prueba después de aplicar
- Verifica todos los casos
- Asegúrate que funciona como esperas

### 4. AND vs OR
- **AND**: Más restrictivo (todas deben cumplirse)
- **OR**: Más permisivo (al menos una debe cumplirse)
- Elige según tu caso de uso

### 5. Operadores Correctos
- **Números**: Usa mayor/menor que
- **Texto**: Usa igual/contiene
- **Booleanos**: Usa igual a true/false
- **Vacío**: Usa está vacío/no está vacío

---

## 🐛 Solución de Problemas

### El campo no aparece/desaparece

**Problema:** Las reglas no funcionan
**Solución:**
1. Verifica que hiciste clic en "Aplicar"
2. Revisa que el campo padre existe
3. Verifica el valor en Preview
4. Revisa el código generado

### El operador no funciona como espero

**Problema:** El operador no hace lo que quiero
**Solución:**
1. Revisa la descripción del operador
2. Prueba con "Ver Código"
3. Verifica el tipo de dato (número vs texto)

### Múltiples reglas no funcionan

**Problema:** Las reglas no se combinan correctamente
**Solución:**
1. Verifica el operador lógico (AND/OR)
2. Prueba cada regla individualmente
3. Revisa el código generado

---

## 📊 Casos de Uso Comunes

### 1. Formulario de Registro
```
SI userType = "business"
ENTONCES mostrar: companyName, taxId, employees
```

### 2. Formulario de Envío
```
SI sameAddress = false
ENTONCES mostrar: shippingAddress, shippingCity, shippingZip
```

### 3. Formulario de Producto
```
SI hasVariants = true
ENTONCES mostrar: variantType, variants
```

### 4. Formulario de Contacto
```
SI contactMethod = "phone"
ENTONCES mostrar: phoneNumber
SI contactMethod = "email"
ENTONCES mostrar: emailAddress
```

### 5. Formulario de Encuesta
```
SI satisfaction < 3
ENTONCES mostrar: improvementSuggestions
```

---

## 🎯 Ventajas del Editor Visual

### vs Escribir Código Manualmente

**Con Editor:**
- ✅ No necesitas saber programar
- ✅ Interfaz visual intuitiva
- ✅ Menos errores
- ✅ Más rápido
- ✅ Fácil de modificar

**Sin Editor:**
- ❌ Necesitas conocer JavaScript
- ❌ Propenso a errores de sintaxis
- ❌ Más lento
- ❌ Difícil de mantener

---

## 🚀 Próximas Mejoras

### En Desarrollo
- [ ] Validación de reglas en tiempo real
- [ ] Sugerencias inteligentes
- [ ] Templates de reglas comunes
- [ ] Importar/Exportar reglas

### Futuro
- [ ] Reglas anidadas (grupos)
- [ ] Operadores personalizados
- [ ] Testing de reglas
- [ ] Visualización de dependencias

---

## 📚 Recursos Adicionales

- **Documentación completa**: Ver `ROADMAP_MEJORAS.md`
- **Ejemplos avanzados**: Ver `GUIA_PROPIEDADES_AVANZADAS.md`
- **Testing**: Ver `PRUEBA_PROPIEDADES_AVANZADAS.md`

---

**¡Crea formularios dinámicos sin escribir código! 🎉**
