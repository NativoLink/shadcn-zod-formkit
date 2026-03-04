# 🧪 Prueba Rápida: Propiedades Avanzadas

## 🚀 Inicio Rápido

```bash
cd example
npm run dev
```

Ve a: http://localhost:3000/form-builder

---

## ✅ Checklist de Pruebas

### 1. Propiedades Básicas (2 min)
- [ ] Arrastra un campo TEXT al canvas
- [ ] Selecciónalo
- [ ] Tab Basic: Cambia name, label, placeholder
- [ ] Marca "Required"
- [ ] Preview: Verifica que aparezca con asterisco

### 2. Propiedades por Tipo (5 min)

#### RATING
- [ ] Arrastra RATING al canvas
- [ ] Tab Advanced: Cambia max a 10
- [ ] Activa "Show Value"
- [ ] Activa "Allow Half"
- [ ] Cambia size a "lg"
- [ ] Preview: Prueba las estrellas

#### PASSWORD
- [ ] Arrastra PASSWORD al canvas
- [ ] Tab Advanced: Activa "Show Strength"
- [ ] Activa "Show Requirements"
- [ ] Tab Behavior: Activa "Validate on Change"
- [ ] Preview: Escribe una contraseña

#### NUMBER
- [ ] Arrastra NUMBER al canvas
- [ ] Tab Advanced: min=18, max=100, step=1
- [ ] Preview: Prueba los límites

### 3. Dependencias (5 min)

#### Caso Simple
- [ ] Arrastra SELECT (name: "country")
- [ ] Arrastra SELECT (name: "city")
- [ ] Selecciona "city"
- [ ] Tab Behavior → Depends On: country
- [ ] Ve el card informativo azul
- [ ] Preview: Verifica la dependencia

#### Caso Checkbox
- [ ] Arrastra CHECKBOX (name: "hasExperience")
- [ ] Arrastra NUMBER (name: "years")
- [ ] Selecciona "years"
- [ ] Tab Behavior → Depends On: hasExperience
- [ ] Preview: Marca/desmarca el checkbox

### 4. Validación Avanzada (3 min)
- [ ] Selecciona cualquier campo
- [ ] Tab Behavior
- [ ] Activa "Validate on Blur"
- [ ] Activa "Show Valid Icon"
- [ ] Preview: Llena el campo y sal (blur)
- [ ] Verifica el icono ✓

### 5. Performance (2 min)
- [ ] Selecciona un campo TEXT
- [ ] Tab Behavior
- [ ] Debounce: 500
- [ ] Preview: Escribe rápido
- [ ] Nota el delay

### 6. Accesibilidad (2 min)
- [ ] Selecciona cualquier campo
- [ ] Tab Behavior
- [ ] ARIA Label: "Campo de prueba"
- [ ] ARIA Required: ✓
- [ ] Preview: Inspecciona el HTML

---

## 🎯 Escenarios Completos

### Escenario 1: Formulario de Registro (5 min)

**Objetivo:** Crear un formulario con campos condicionales

1. **Campo: userType**
   - Tipo: SELECT
   - Label: "Tipo de Usuario"
   - Opciones: Estudiante, Profesor

2. **Campo: studentId**
   - Tipo: TEXT
   - Label: "ID de Estudiante"
   - Depends On: userType
   - (En código: showWhen si userType = "Estudiante")

3. **Campo: teacherCode**
   - Tipo: TEXT
   - Label: "Código de Profesor"
   - Depends On: userType
   - (En código: showWhen si userType = "Profesor")

4. **Preview:** Cambia userType y ve los campos aparecer/desaparecer

### Escenario 2: Formulario de Producto (5 min)

**Objetivo:** Producto con variantes opcionales

1. **Campo: productName**
   - Tipo: TEXT
   - Label: "Nombre del Producto"
   - Required: ✓
   - maxLength: 100
   - showCharCount: ✓

2. **Campo: price**
   - Tipo: NUMBER
   - Label: "Precio"
   - min: 0
   - step: 0.01

3. **Campo: rating**
   - Tipo: RATING
   - Label: "Calificación"
   - max: 5
   - showValue: ✓

4. **Campo: hasVariants**
   - Tipo: CHECKBOX
   - Label: "¿Tiene variantes?"

5. **Campo: variantType**
   - Tipo: SELECT
   - Label: "Tipo de Variante"
   - Depends On: hasVariants

6. **Preview:** Prueba todo el flujo

### Escenario 3: Formulario de Contacto (3 min)

**Objetivo:** Formulario simple con validación

1. **Campo: name**
   - Tipo: TEXT
   - Required: ✓
   - maxLength: 50
   - showCharCount: ✓

2. **Campo: email**
   - Tipo: TEXT
   - Required: ✓
   - validateOnBlur: ✓

3. **Campo: phone**
   - Tipo: PHONE
   - defaultCountryCode: "+52"

4. **Campo: message**
   - Tipo: TEXTAREA
   - Required: ✓
   - maxLength: 500
   - showCharCount: ✓

5. **Preview:** Llena y envía

---

## 🐛 Qué Verificar

### Funcionalidad
- [ ] Propiedades se guardan al cambiar
- [ ] Preview se actualiza en tiempo real
- [ ] Dependencias funcionan correctamente
- [ ] Validaciones se aplican
- [ ] Export/Import mantiene propiedades

### UI/UX
- [ ] Tabs se ven bien
- [ ] Propiedades organizadas lógicamente
- [ ] Badge muestra el tipo de input
- [ ] Card informativo aparece con dependencias
- [ ] Tooltip amarillo visible

### Performance
- [ ] No hay lag al cambiar propiedades
- [ ] Preview responde rápido
- [ ] Selector de dependencias carga rápido

---

## 📊 Resultados Esperados

### ✅ Todo Funciona Si:
1. Puedes cambiar entre los 3 tabs
2. Ves propiedades diferentes según el tipo de input
3. Puedes configurar dependencias
4. Preview muestra los cambios
5. Export incluye todas las propiedades

### ❌ Hay Problema Si:
1. Tabs no cambian
2. Propiedades no se guardan
3. Preview no se actualiza
4. Dependencias no aparecen en selector
5. Errores en consola

---

## 💡 Tips de Prueba

1. **Empieza simple**: Prueba un campo a la vez
2. **Usa Preview**: Verifica cada cambio
3. **Prueba dependencias**: Es la funcionalidad más compleja
4. **Export/Import**: Verifica que se mantengan las propiedades
5. **Consola**: Revisa si hay errores

---

## 🎊 Checklist Final

- [ ] Probé los 3 tabs
- [ ] Probé al menos 3 tipos de inputs diferentes
- [ ] Configuré al menos 1 dependencia
- [ ] Probé validación avanzada
- [ ] Probé en Preview
- [ ] Exporté e importé
- [ ] Todo funciona correctamente

---

**Tiempo total estimado: 20-30 minutos**

**¡Disfruta probando el Form Builder mejorado! 🚀**
