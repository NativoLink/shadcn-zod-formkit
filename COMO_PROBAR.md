# 🧪 Cómo Probar las Nuevas Características

## 🚀 Inicio Rápido (3 pasos)

### 1️⃣ Compilar la librería
```bash
npm run build
```

### 2️⃣ Iniciar el ejemplo
```bash
cd example
npm run dev
```

### 3️⃣ Abrir en el navegador
Abre: **http://localhost:3000**

Busca la pestaña: **"✨ New Features"**

---

## 🎯 ¿Qué hay de nuevo?

### ⭐ Rating Input
Calificación con estrellas (1-5)
- Haz clic en las estrellas
- Observa el valor numérico
- Prueba el hover effect

### 📱 Phone Input
Teléfono con código de país
- Selecciona un país (🇺🇸 🇲🇽 🇩🇴 🇪🇸)
- Escribe un número
- Verifica el formato

### 🔗 URL Input
URL con auto-protocolo
- Escribe "example.com"
- Haz blur → se convierte en "https://example.com"
- Haz clic en el botón 🔗 para abrir

### 🔒 Password Input
Contraseña con medidor de fortaleza
- Escribe "123" → Débil (rojo)
- Escribe "MyP@ssw0rd" → Fuerte (verde)
- Observa los requisitos con ✓ y ✗
- Haz clic en el 👁️ para mostrar/ocultar

### 📝 Username Input (mejorado)
Con contador y botón de limpiar
- Escribe más de 20 caracteres
- Observa el contador "X/20"
- Haz clic en la X para limpiar

---

## 📊 Panel de Datos

En el lado derecho verás:
- Datos del formulario en tiempo real
- Formato JSON
- Actualización automática

---

## ✅ Pruebas Rápidas

### Test 1: Rating
1. No califiques nada
2. Haz clic en "Guardar"
3. ❌ Debe mostrar error
4. Califica con 3 estrellas
5. ✅ Debe permitir enviar

### Test 2: Phone
1. Selecciona "+52" (México)
2. Escribe "55 1234 5678"
3. ✅ Debe formatear correctamente

### Test 3: URL
1. Escribe "github.com"
2. Haz blur (clic fuera)
3. ✅ Debe convertirse en "https://github.com"
4. Haz clic en el botón 🔗
5. ✅ Debe abrir en nueva pestaña

### Test 4: Password
1. Escribe "pass"
2. ❌ Debe mostrar "Weak" en rojo
3. Escribe "MyP@ssw0rd123"
4. ✅ Debe mostrar "Strong" en verde
5. ✅ Todos los requisitos con ✓

### Test 5: Username
1. Escribe "ab"
2. ❌ Error: mínimo 3 caracteres
3. Escribe "john_doe_123"
4. ✅ Debe mostrar "12/20"

---

## 🐛 Solución de Problemas

### No veo los cambios
```bash
# Recompila
npm run build

# Reinicia el ejemplo
cd example
npm run dev
```

### Error de compilación
```bash
# Limpia y recompila
rm -rf dist
npm run build
```

### El ejemplo no inicia
```bash
cd example
rm -rf .next
npm run dev
```

---

## 📖 Más Información

- **QUICK_START.md** - Guía de inicio rápido
- **TESTING_GUIDE.md** - Guía detallada de pruebas
- **NEW_FEATURES.md** - Documentación completa
- **IMPROVEMENTS.md** - Roadmap y futuras mejoras

---

## 🎉 ¡Eso es todo!

Las nuevas características están listas para probar.

**¿Encontraste un bug?** Abre un issue
**¿Tienes sugerencias?** Abre un issue
**¿Te gustó?** Dale una ⭐ en GitHub

---

## 📝 Datos de Prueba Sugeridos

**Username:** `john_doe`
**Rating:** 4 estrellas
**Phone:** `+1 555-1234`
**Website:** `github.com` (se auto-completa)
**Password:** `MyP@ssw0rd123`

---

¡Feliz testing! 🚀
