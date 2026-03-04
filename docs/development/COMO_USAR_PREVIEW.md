# 👁️ Cómo Usar el Preview

## 🚀 Inicio Rápido

### 1. Inicia el servidor
```bash
cd example
npm run dev
```

### 2. Abre el Form Builder
Ve a: http://localhost:3000/form-builder

---

## 🎨 Modo Builder

1. **Arrastra** campos desde el panel izquierdo al canvas
2. **Haz clic** en un campo para seleccionarlo
3. **Edita** las propiedades en el panel derecho
4. **Agrega** más campos según necesites

---

## 👁️ Modo Preview (NUEVO)

1. **Haz clic** en el tab "👁️ Preview"
2. **Verás** tu formulario renderizado en tiempo real
3. **Llena** el formulario como lo haría un usuario
4. **Haz clic** en "Submit" para ver los datos capturados

---

## ⚡ Actualización en Tiempo Real

Los cambios que hagas en el Builder se reflejan **instantáneamente** en el Preview:

1. Estás en Preview viendo tu formulario
2. Cambias al tab Builder
3. Modificas el label de un campo
4. Regresas al tab Preview
5. ¡El cambio ya está ahí! ✨

---

## 📊 Qué Puedes Ver en Preview

### Lado Izquierdo: Formulario en Vivo
- El formulario tal como lo verán los usuarios
- Todos los campos funcionando
- Validaciones en tiempo real
- Botón de submit funcional

### Lado Derecho Superior: Datos del Formulario
- Los datos que captura el formulario
- Se actualiza cuando haces submit
- Formato JSON fácil de leer

### Lado Derecho Inferior: Configuración
- La configuración JSON completa
- Útil para copiar/pegar
- Muestra cuántos campos tienes

---

## 💡 Ejemplo de Uso

### Paso 1: Construir
```
Tab Builder:
- Arrastra "Text" → configura como "username"
- Arrastra "Rating" → configura como "rating"
- Arrastra "Password" → activa "Show Strength"
```

### Paso 2: Previsualizar
```
Tab Preview:
- Ve los 3 campos renderizados
- Llena username: "juan123"
- Selecciona rating: 4 estrellas
- Escribe password: "MiPassword123!"
- Click en Submit
```

### Paso 3: Ver Resultados
```
Datos capturados:
{
  "username": "juan123",
  "rating": 4,
  "password": "MiPassword123!"
}
```

---

## 🎯 Casos de Uso

### Testing Rápido
- Construye → Preview → Prueba → Ajusta → Repite

### Demostración
- Muestra el builder a tu equipo
- Alterna a preview para mostrar el resultado
- Explica cómo funciona

### Debugging
- ¿Un campo no se ve bien? → Ve al Preview
- ¿Los datos no se capturan? → Revisa en Preview
- ¿La configuración está mal? → Verifica el JSON en Preview

---

## ✅ Ventajas

1. **Feedback Inmediato**: No esperas, ves los cambios al instante
2. **Sin Salir del Builder**: Todo en una sola página
3. **Testing Integrado**: Prueba mientras construyes
4. **Debugging Visual**: Identifica problemas rápidamente

---

## 🎊 ¡Eso es Todo!

Es así de simple:
1. Construye en Builder 🎨
2. Ve en Preview 👁️
3. Repite hasta que esté perfecto ✨

**¡Disfruta construyendo formularios! 🚀**
