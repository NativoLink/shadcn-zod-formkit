# 👁️ Preview Feature - Form Builder

## ✨ Nueva Funcionalidad Agregada

Se ha implementado un sistema de tabs que permite alternar entre el modo Builder y el modo Preview.

---

## 🎯 Características

### Tab 1: 🎨 Builder
El modo constructor original con:
- Paleta de componentes (izquierda)
- Canvas de construcción (centro)
- Panel de propiedades (derecha)

### Tab 2: 👁️ Preview
Vista previa en tiempo real con:
- **Formulario en vivo**: Renderizado real del formulario
- **Datos del formulario**: Muestra los datos cuando se envía
- **Configuración JSON**: Muestra la configuración completa de los campos

---

## 🎨 Layout del Preview

```
┌─────────────────────────────────────────────────────────┐
│  🎨 Builder  |  👁️ Preview                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │                      │  │                      │    │
│  │   Live Form          │  │   Form Data          │    │
│  │   ┌──────────────┐   │  │   {                  │    │
│  │   │ Username     │   │  │     "username": "",  │    │
│  │   │ [_________]  │   │  │     "rating": 0      │    │
│  │   │              │   │  │   }                  │    │
│  │   │ Rating       │   │  │                      │    │
│  │   │ ⭐⭐⭐⭐⭐    │   │  │                      │    │
│  │   │              │   │  │   Configuration      │    │
│  │   │ [Submit]     │   │  │   [                  │    │
│  │   └──────────────┘   │  │     {                │    │
│  │                      │  │       "name": "..."  │    │
│  │                      │  │     }                │    │
│  └──────────────────────┘  │   ]                  │    │
│                            └──────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Cómo Usar

### 1. Construir en Builder
1. Ve al tab "🎨 Builder"
2. Arrastra campos desde la paleta
3. Configura propiedades

### 2. Ver en Preview
1. Cambia al tab "👁️ Preview"
2. Verás el formulario renderizado en tiempo real
3. Prueba llenando el formulario
4. Haz clic en "Submit" para ver los datos

### 3. Alternar Entre Tabs
- Los cambios en Builder se reflejan instantáneamente en Preview
- Puedes alternar entre tabs en cualquier momento
- Los datos del formulario se mantienen mientras estés en Preview

---

## 📊 Secciones del Preview

### 1. Live Form (Izquierda)
- Formulario completamente funcional
- Usa el componente `DynamicForm` real
- Validación en tiempo real
- Botón de submit funcional

### 2. Form Data (Derecha Superior)
- Muestra los datos enviados
- Se actualiza al hacer submit
- Formato JSON legible
- Útil para debugging

### 3. Configuration (Derecha Inferior)
- Muestra la configuración completa de campos
- Formato JSON con sintaxis highlighting
- Útil para copiar/pegar
- Muestra el conteo de campos

---

## 💡 Casos de Uso

### Testing Rápido
1. Agrega campos en Builder
2. Cambia a Preview
3. Prueba el formulario inmediatamente
4. Regresa a Builder para ajustar

### Validación Visual
- Verifica que los campos se vean correctamente
- Prueba las validaciones
- Verifica placeholders y descripciones
- Prueba valores por defecto

### Demostración
- Muestra el formulario a clientes/equipo
- Alterna entre construcción y resultado
- Explica la configuración JSON

### Debugging
- Verifica que los datos se capturen correctamente
- Revisa la estructura JSON
- Identifica problemas de configuración

---

## 🎨 Características Visuales

### Empty State
Cuando no hay campos:
```
     👁️
No Preview Available

Switch to the Builder tab and 
add some fields to see the preview
```

### Alert Informativo
```
ℹ️ This is a live preview. Changes made in 
   the Builder tab will appear here instantly.
```

### Código con Sintaxis
- JSON de datos: fondo negro, texto verde (terminal style)
- JSON de configuración: fondo negro, texto azul
- Fuente monoespaciada para mejor legibilidad

---

## 🔧 Detalles Técnicos

### Componente: PreviewPanel.tsx
```typescript
interface PreviewPanelProps {
  fields: FieldProps<any>[];
}
```

### Características:
- Recibe los campos del estado principal
- Crea un record vacío con valores por defecto
- Usa `DynamicForm` para renderizar
- Captura datos del submit
- Muestra JSON formateado

### Integración:
- Integrado con Tabs de shadcn/ui
- Comparte estado con el Builder
- Actualización en tiempo real
- Sin necesidad de "refresh"

---

## ✅ Ventajas

1. **Feedback Inmediato**: Ve los cambios al instante
2. **Testing Integrado**: No necesitas salir del builder
3. **Debugging Visual**: Identifica problemas rápidamente
4. **Mejor UX**: Alterna fácilmente entre modos
5. **Educativo**: Entiende cómo funciona la configuración

---

## 🎯 Próximas Mejoras Posibles

- [ ] Modo responsive preview (mobile/tablet/desktop)
- [ ] Temas (light/dark) en preview
- [ ] Copiar JSON con un botón
- [ ] Descargar datos del formulario
- [ ] Modo "fullscreen" para preview
- [ ] Comparar antes/después de cambios

---

## 📝 Ejemplo de Flujo de Trabajo

```
1. Builder Tab
   ├─ Arrastra "Text" input
   ├─ Configura: name="username", label="Username"
   └─ Arrastra "Rating" input

2. Preview Tab
   ├─ Ve el formulario renderizado
   ├─ Llena username: "john_doe"
   ├─ Selecciona rating: 4 estrellas
   ├─ Click Submit
   └─ Ve datos: { "username": "john_doe", "rating": 4 }

3. Builder Tab (ajustes)
   ├─ Cambia label a "User Name"
   └─ Agrega description

4. Preview Tab
   └─ Ve los cambios aplicados instantáneamente
```

---

## 🚀 Listo para Probar

La funcionalidad de Preview está completamente implementada y lista para usar.

**Inicia el servidor y pruébalo:**
```bash
cd example
npm run dev
```

Navega a: http://localhost:3000/form-builder

---

**¡Disfruta construyendo y previsualizando tus formularios! 🎨👁️**
