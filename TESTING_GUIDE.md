# 🧪 Guía de Pruebas - Nuevas Características

## 📋 Pasos para Probar

### 1. Compilar la Librería

```bash
# En la raíz del proyecto
npm run build
```

Esto compilará todos los nuevos componentes y características.

### 2. Iniciar el Ejemplo

```bash
# Ir a la carpeta example
cd example

# Instalar dependencias (si es necesario)
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

### 3. Abrir en el Navegador

Abre [http://localhost:3000](http://localhost:3000)

Verás 3 pestañas:
- **Basics** - Formularios básicos existentes
- **Advanced** - Formularios avanzados existentes
- **✨ New Features** - ¡Los nuevos inputs!

---

## 🎯 Qué Probar

### Tab "✨ New Features"

#### 1. **Username Input** (con nuevas props)
- ✅ Escribe más de 20 caracteres → debe mostrar contador
- ✅ Verifica que muestre "X/20"
- ✅ Prueba el botón de limpiar (X)

#### 2. **Rating Input** ⭐
- ✅ Haz clic en las estrellas
- ✅ Verifica que muestre el valor numérico
- ✅ Intenta cambiar la calificación
- ✅ Observa el hover effect

#### 3. **Phone Input** 📱
- ✅ Selecciona diferentes códigos de país
- ✅ Escribe un número de teléfono
- ✅ Verifica que se formatee correctamente
- ✅ Prueba con diferentes países (US, MX, DO, ES, etc.)

#### 4. **Website Input** 🔗
- ✅ Escribe una URL sin "https://"
- ✅ Haz blur → debe agregar "https://" automáticamente
- ✅ Escribe una URL completa
- ✅ Haz clic en el botón de preview → debe abrir en nueva pestaña

#### 5. **Password Input** 🔒
- ✅ Escribe una contraseña débil → debe mostrar "Weak" en rojo
- ✅ Agrega mayúsculas, números, caracteres especiales
- ✅ Observa cómo cambia el medidor de fortaleza
- ✅ Verifica los checkmarks de requisitos
- ✅ Haz clic en el ojo para mostrar/ocultar contraseña

---

## 🔍 Validaciones a Verificar

### Rating
- ❌ Intenta enviar sin calificar → debe mostrar error
- ✅ Califica con 1-5 estrellas → debe permitir enviar

### Phone
- ❌ Deja vacío → debe mostrar error
- ✅ Escribe un número válido → debe permitir enviar

### Website
- ❌ Escribe "not-a-url" → debe mostrar error
- ✅ Escribe "example.com" → debe auto-completar a "https://example.com"
- ✅ Deja vacío (es opcional) → debe permitir enviar

### Password
- ❌ Escribe "123" → debe mostrar múltiples errores
- ❌ Escribe "password" → debe fallar (sin mayúsculas, números, especiales)
- ✅ Escribe "MyP@ssw0rd" → debe pasar todas las validaciones

### Username
- ❌ Escribe "ab" → debe mostrar error (mínimo 3 caracteres)
- ❌ Escribe más de 20 caracteres → debe mostrar error
- ✅ Escribe "john_doe" → debe ser válido

---

## 📊 Panel de Datos

En el lado derecho verás un panel que muestra:
- Los datos del formulario en tiempo real
- Formato JSON para fácil inspección

### Qué verificar:
- ✅ Los valores se actualizan al escribir
- ✅ El rating muestra como número (1-5)
- ✅ El phone incluye el código de país
- ✅ El website tiene el protocolo completo
- ✅ El password se guarda (aunque no se muestra en el panel por seguridad)

---

## 🐛 Posibles Problemas y Soluciones

### Error: "Module not found"
```bash
# Vuelve a compilar la librería
cd ..
npm run build
cd example
npm run dev
```

### Los inputs no aparecen
- Verifica que estés en la pestaña "✨ New Features"
- Revisa la consola del navegador para errores
- Asegúrate de que el build se completó sin errores

### Estilos rotos
```bash
# En la carpeta example
npm install
```

### TypeScript errors
```bash
# Limpia y reconstruye
npm run build
```

---

## ✅ Checklist de Pruebas

### Funcionalidad Básica
- [ ] Todos los inputs se renderizan correctamente
- [ ] Los labels se muestran
- [ ] Los placeholders funcionan
- [ ] Los descriptions se muestran

### Interactividad
- [ ] Rating: clic en estrellas funciona
- [ ] Phone: selector de país funciona
- [ ] Website: botón de preview funciona
- [ ] Password: toggle show/hide funciona
- [ ] Username: contador de caracteres funciona

### Validaciones
- [ ] Errores se muestran correctamente
- [ ] Validaciones de Zod funcionan
- [ ] Mensajes de error son claros
- [ ] Form no se envía con errores

### UX
- [ ] Animaciones son suaves
- [ ] Hover effects funcionan
- [ ] Focus states son visibles
- [ ] Responsive en móvil

### Datos
- [ ] Panel muestra datos correctos
- [ ] Valores se actualizan en tiempo real
- [ ] Submit envía datos correctos
- [ ] Console.log muestra datos completos

---

## 🎨 Características Visuales a Observar

### Rating Input
- Estrellas amarillas cuando están llenas
- Estrellas grises cuando están vacías
- Efecto de escala al hacer hover
- Valor numérico al lado

### Phone Input
- Banderas de países en el selector
- Formato del número mientras escribes
- Dropdown con scroll

### Website Input
- Icono de link a la izquierda
- Botón de external link a la derecha
- Auto-completado de protocolo

### Password Input
- Barra de progreso de fortaleza
- Colores: rojo (débil), amarillo (medio), verde (fuerte)
- Checkmarks verdes cuando cumple requisitos
- X grises cuando no cumple

---

## 📝 Notas Adicionales

### Datos de Prueba Sugeridos

**Username:**
- `john_doe` ✅
- `ab` ❌ (muy corto)
- `this_is_a_very_long_username_that_exceeds_limit` ❌ (muy largo)

**Phone:**
- `+1 555-1234` ✅
- `+52 55 1234 5678` ✅
- `+1-809 555-1234` ✅ (República Dominicana)

**Website:**
- `example.com` → se convierte en `https://example.com` ✅
- `https://github.com` ✅
- `not a url` ❌

**Password:**
- `MyP@ssw0rd123` ✅ (fuerte)
- `password` ❌ (débil)
- `Pass123` ❌ (sin caracteres especiales)

---

## 🚀 Próximos Pasos

Una vez que hayas probado todo:

1. **Reporta bugs** si encuentras alguno
2. **Sugiere mejoras** de UX
3. **Prueba en diferentes navegadores** (Chrome, Firefox, Safari)
4. **Prueba en móvil** para verificar responsive
5. **Revisa la consola** para warnings o errors

---

## 💡 Tips

- Usa las DevTools del navegador (F12) para inspeccionar
- Revisa la pestaña Network para ver requests
- Usa React DevTools para ver el estado de los componentes
- Prueba con diferentes tamaños de ventana

---

¡Disfruta probando las nuevas características! 🎉
