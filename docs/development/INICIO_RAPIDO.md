# 🚀 Inicio Rápido - Form Builder

## ⚡ Empieza en 3 Pasos

### 1️⃣ Inicia el Servidor
```bash
cd example
npm run dev
```

### 2️⃣ Abre el Form Builder
Ve a: **http://localhost:3000/form-builder**

### 3️⃣ Construye tu Primer Formulario

#### En el Tab Builder:
1. **Arrastra** "Texto" desde la paleta izquierda
2. **Haz clic** en el campo para seleccionarlo
3. **Configura** en el panel derecho:
   - Nombre: `username`
   - Etiqueta: `Nombre de Usuario`
   - Requerido: ✓

4. **Arrastra** "Calificación" al canvas
5. **Configura**:
   - Nombre: `rating`
   - Etiqueta: `Califica tu experiencia`
   - Máximo de estrellas: 5
   - Mostrar valor: ✓

#### En el Tab Preview:
1. **Cambia** al tab "👁️ Preview"
2. **Llena** el formulario
3. **Haz clic** en "Submit"
4. **Ve** los datos capturados

#### Exporta:
1. **Haz clic** en "📤 Export" en el toolbar
2. **Descarga** el archivo JSON
3. **Úsalo** en tu aplicación

---

## 🎯 Qué Puedes Hacer

### En el Tab Builder 🎨
- Arrastrar 14 tipos de inputs diferentes
- Configurar propiedades en 3 tabs:
  - **Básico**: Nombre, etiqueta, placeholder
  - **Avanzado**: Propiedades específicas del tipo
  - **Comportamiento**: Dependencias y validaciones
- Reordenar campos arrastrándolos
- Duplicar y eliminar campos
- Exportar/Importar configuración JSON

### En el Tab Preview 👁️
- Ver el formulario renderizado en tiempo real
- Probar el formulario como usuario final
- Ver los datos capturados al enviar
- Inspeccionar la configuración JSON

---

## 📋 Tipos de Inputs Disponibles

1. 📝 **Texto** - Campos de texto simple
2. 🔢 **Número** - Números con min/max/step
3. 📱 **Teléfono** - Con código de país
4. 🔗 **URL** - Con vista previa
5. 🔒 **Contraseña** - Con indicador de fortaleza
6. ⭐ **Calificación** - Estrellas configurables
7. 🎨 **Color** - Selector de color
8. 📅 **Fecha** - Selector de fecha
9. ⏰ **Hora** - Selector de hora
10. 📋 **Select** - Lista desplegable
11. ☑️ **Checkbox** - Casilla de verificación
12. 🔄 **Switch** - Interruptor
13. 🎯 **Slider** - Control deslizante
14. 📄 **Textarea** - Texto multilínea

---

## 🔄 Ejemplo: Dependencias Entre Campos

### Caso: País → Estado → Ciudad

1. **Agrega** campo "País" (SELECT)
   - Nombre: `country`

2. **Agrega** campo "Estado" (SELECT)
   - Nombre: `state`
   - Tab Comportamiento → Depende de: `country`

3. **Agrega** campo "Ciudad" (SELECT)
   - Nombre: `city`
   - Tab Comportamiento → Depende de: `state`

4. **Preview**: Selecciona país → Estado se actualiza → Selecciona estado → Ciudad se actualiza

---

## 💡 Tips Rápidos

### Para Empezar
- Empieza con campos simples (Texto, Número)
- Configura solo lo básico al principio
- Usa Preview para ver los cambios

### Para Propiedades Avanzadas
- Explora el tab Avanzado según el tipo de input
- Cada tipo tiene propiedades únicas
- Lee los tooltips para más información

### Para Dependencias
- Planifica la estructura antes
- Usa el tab Comportamiento
- Prueba en Preview inmediatamente

### Para Validación
- "Validar al perder foco" es más amigable
- "Validar al cambiar" para campos críticos
- Usa debounce para mejor performance

---

## 📚 Documentación Completa

- **RESUMEN_FINAL_ESPAÑOL.md** - Resumen completo
- **GUIA_PROPIEDADES_AVANZADAS.md** - Guía detallada
- **PRUEBA_PROPIEDADES_AVANZADAS.md** - Casos de prueba
- **COMO_USAR_PREVIEW.md** - Guía del preview

---

## ✅ Checklist de Tu Primer Formulario

- [ ] Servidor iniciado
- [ ] Form Builder abierto
- [ ] Primer campo agregado
- [ ] Propiedades configuradas
- [ ] Segundo campo agregado
- [ ] Preview probado
- [ ] Formulario enviado
- [ ] Datos visualizados
- [ ] JSON exportado

---

## 🎊 ¡Eso es Todo!

Ya estás listo para crear formularios increíbles con el Form Builder.

**Tiempo estimado:** 5 minutos para tu primer formulario

**¡Diviértete construyendo! 🚀**
