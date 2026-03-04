# 🚀 Quick Start - Probar Nuevas Características

## Opción 1: Script Automático (Recomendado)

```bash
./test-new-features.sh
```

Este script:
1. ✅ Compila la librería automáticamente
2. ✅ Inicia el servidor de ejemplo
3. ✅ Abre en http://localhost:3000

## Opción 2: Manual

### Paso 1: Compilar

```bash
npm run build
```

### Paso 2: Iniciar Ejemplo

```bash
cd example
npm run dev
```

### Paso 3: Abrir Navegador

Abre [http://localhost:3000](http://localhost:3000)

---

## 🎯 ¿Dónde están las nuevas características?

1. Abre http://localhost:3000
2. Busca la pestaña **"✨ New Features"**
3. ¡Prueba los nuevos inputs!

---

## 🆕 Nuevos Inputs Disponibles

### 1. ⭐ Rating Input
- Calificación con estrellas
- Muestra valor numérico
- Hover effects

### 2. 📱 Phone Input
- Selector de código de país
- Banderas de países
- Formato automático

### 3. 🔗 URL Input
- Auto-completa "https://"
- Botón de preview
- Validación de URL

### 4. 🔒 Password Input
- Medidor de fortaleza
- Requisitos visuales
- Mostrar/ocultar contraseña

### 5. 📝 Username Input (mejorado)
- Contador de caracteres
- Botón de limpiar
- Validación en tiempo real

---

## 📊 Panel de Datos

En el lado derecho verás los datos del formulario en tiempo real.

---

## 🐛 ¿Problemas?

### Error al compilar
```bash
# Limpia y vuelve a intentar
rm -rf dist
npm run build
```

### El ejemplo no inicia
```bash
cd example
rm -rf node_modules .next
npm install
npm run dev
```

### Los cambios no se reflejan
```bash
# Recompila la librería
npm run build

# Reinicia el ejemplo
cd example
npm run dev
```

---

## 📖 Documentación Completa

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Guía detallada de pruebas
- [NEW_FEATURES.md](./NEW_FEATURES.md) - Documentación de características
- [IMPROVEMENTS.md](./IMPROVEMENTS.md) - Roadmap y mejoras

---

## ✅ Checklist Rápido

- [ ] Compilé la librería (`npm run build`)
- [ ] Inicié el ejemplo (`cd example && npm run dev`)
- [ ] Abrí http://localhost:3000
- [ ] Encontré la pestaña "✨ New Features"
- [ ] Probé cada input nuevo
- [ ] Verifiqué las validaciones
- [ ] Revisé el panel de datos

---

## 💡 Tips

- Usa **Chrome DevTools** (F12) para debugging
- Revisa la **consola** para ver los datos enviados
- Prueba en **móvil** para ver responsive
- Intenta **romper** las validaciones

---

¡Disfruta probando! 🎉

¿Preguntas? Abre un issue en GitHub.
