# 📁 File Upload Example - Implementado

## ✅ Completado

Se ha agregado un ejemplo completo y funcional del input `FILE_UPLOAD` en la aplicación de ejemplos.

## 📁 Archivos Creados

### 1. FileUploadForm.tsx
**Ruta:** `example/app/examples/advanced/FileUploadForm.tsx`

**Características del Ejemplo:**
- ✅ Carga de archivos con drag & drop
- ✅ Barra de progreso visual
- ✅ Vista previa de imágenes y PDFs
- ✅ Validación de tamaño de archivo
- ✅ Validación de tipo de archivo
- ✅ Múltiples campos de carga (obligatorio y opcionales)
- ✅ Feedback visual de éxito
- ✅ Integración con `zod` y `DynamicForm`

### 2. Integración en UI de Ejemplos
Se agregó una pestaña nueva en la página principal de ejemplos:
- 📁 `File Upload`

## 🎨 Características del Ejemplo

### Sección 1: Campos de Carga
- **Profile Picture** (requerido): Solo imágenes, máximo 5MB
- **Document** (opcional): Imágenes o PDFs, máximo 10MB
- **Additional Attachment** (opcional): Cualquier archivo, máximo 20MB

### Sección 2: Validación Visual
- Drag & drop habilitado
- Barra de progreso animada
- Vista previa para imágenes y PDFs
- Mensajes de error claros
- Estado de éxito confirmado

### Sección 3: Visualización de Resultado
- JSON del archivo cargado:
```json
{
  "name": "photo.jpg",
  "size": 1024000,
  "type": "image/jpeg",
  "uploadedUrl": "https://example.com/uploads/photo.jpg"
}
```

## 🔧 Props Recomendadas

```typescript
<FileUploadInput
  value={file}
  onChange={setFile}
  label="Cargar Archivo"
  placeholder="Arrastra o haz clic para seleccionar"
  required
  fileConfig={{
    dragAndDrop: true,
    progressBar: true,
    uploadUrl: '/api/upload',
    previewFormats: {
      image: true,
      pdf: true,
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedFormats: ['image/*', 'application/pdf'],
  }}
/>
```

## ✅ Beneficios
- Experiencia de usuario superior con drag & drop
- Feedback visual en tiempo real con barra de progreso
- Vista previa inmediata de archivos soportados
- Validación de límites de tamaño
- Ideal para formularios de perfil, documentos y multimedia
