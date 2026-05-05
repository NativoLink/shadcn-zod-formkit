# 🎉 Nuevos Inputs - v1.37.0

## ✅ Inputs Implementados

### 1. 📁 FILE_UPLOAD Input

**Características:**
- ✅ Drag & drop para archivos
- ✅ Barra de progreso de carga
- ✅ Validación de tipos de archivo
- ✅ Validación de tamaño máximo
- ✅ Vista previa (imágenes, videos, audio, PDF)
- ✅ Múltiples archivos o un solo archivo
- ✅ Callbacks de progreso y completación
- ✅ Cancelación de carga
- ✅ Manejo de errores de upload
- ✅ Integración completa con React Hook Form

**Datos retornados:**
```typescript
interface FileData {
  name: string;                    // Nombre del archivo
  size: number;                    // Tamaño en bytes
  type: string;                    // Tipo MIME
  lastModified: number;            // Timestamp de modificación
  file?: File;                     // Objeto File original
  preview?: string;                // Data URL para vista previa
  uploadProgress?: number;         // Progreso de carga (0-100)
  uploadedUrl?: string;            // URL después del upload
}
```

**Props (FileConfig):**
```typescript
interface FileConfig {
  dragAndDrop?: boolean;           // Habilitar drag & drop (default: true)
  progressBar?: boolean;            // Mostrar barra de progreso (default: true)
  uploadUrl?: string;               // URL del endpoint para subir
  onUploadProgress?: (progress: number) => void;  // Callback de progreso
  onUploadComplete?: (response: any) => void;    // Callback de completación
  previewFormats?: {
    image?: boolean;               // Preview para imágenes (default: true)
    video?: boolean;               // Preview para videos (default: false)
    audio?: boolean;               // Preview para audio (default: false)
    pdf?: boolean;                 // Preview para PDFs (default: false)
  };
  maxSize?: number;                // Tamaño máximo en bytes (default: 10MB)
  maxFiles?: number;               // Número máximo de archivos
  acceptedFormats?: string[];      // Tipos MIME aceptados
  multiple?: boolean;              // Permitir múltiples archivos
}
```

**Ejemplo de uso básico:**
```typescript
<FileUploadInput
  value={file}
  onChange={setFile}
  label="Cargar Archivo"
  placeholder="Arrastra aquí o haz clic para seleccionar"
  required
  fileConfig={{
    dragAndDrop: true,
    progressBar: true,
    previewFormats: {
      image: true,
      pdf: true,
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedFormats: ['image/*', 'application/pdf'],
  }}
/>
```

**Ejemplo con upload automático:**
```typescript
<FileUploadInput
  value={file}
  onChange={setFile}
  label="Cargar Documento"
  required
  fileConfig={{
    dragAndDrop: true,
    progressBar: true,
    uploadUrl: '/api/upload',
    onUploadProgress: (progress) => {
      console.log(`Cargado: ${progress}%`);
    },
    onUploadComplete: (response) => {
      console.log('Upload completado:', response);
    },
    previewFormats: {
      image: true,
      pdf: true,
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  }}
/>
```

**Integración con DynamicForm:**
```typescript
{
  name: 'profilePicture',
  label: 'Foto de Perfil',
  inputType: InputTypes.FILE_UPLOAD,
  zodType: z.object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
    uploadedUrl: z.string().url(),
  }),
  required: true,
  fileConfig: {
    dragAndDrop: true,
    progressBar: true,
    uploadUrl: '/api/upload/profile',
    previewFormats: {
      image: true,
    },
    maxSize: 5 * 1024 * 1024,
    acceptedFormats: ['image/*'],
  },
}
```

---

## 🎯 Casos de Uso

### FILE_UPLOAD Input
- ✅ Carga de avatar/perfil
- ✅ Carga de documentos (facturas, contratos)
- ✅ Carga de imágenes de productos
- ✅ Carga de multimedia (video, audio)
- ✅ Carga de certificados
- ✅ Carga de comprobantes
- ✅ Carga de CV
- ✅ Carga de licencias

---

## 🔧 Características Destacadas

### 1. Drag & Drop Intuitivo
- Área clara para arrastrar archivos
- Feedback visual (hover effect)
- Alternativa con botón de selección

### 2. Barra de Progreso en Tiempo Real
- Visualización porcentual
- Animación suave
- Feedback inmediato del usuario

### 3. Vista Previa Inteligente
- Imágenes: miniaturas generadas
- PDFs: indicador de documento
- Videos/Audio: iconos específicos
- Archivos genéricos: icono de archivo

### 4. Validación Robusta
- Validación de tamaño
- Validación de tipo MIME
- Mensajes de error claros
- Límite de archivos

### 5. Integración de Upload
- XHR para control de progreso
- Endpoint personalizable
- Callbacks para éxito y error
- Respuesta JSON procesada

### 6. Experiencia del Usuario
- Estados visuales claros (cargando, completado, error)
- Botón para remover archivo
- Información de tamaño legible
- Confirmación visual de éxito

---

## 📦 Integración con DynamicForm

```typescript
import { DynamicForm, InputTypes } from 'shadcn-zod-formkit';
import { z } from 'zod';

const fields = [
  {
    name: 'document',
    label: 'Documento Requerido',
    inputType: InputTypes.FILE_UPLOAD,
    zodType: z.object({
      name: z.string(),
      size: z.number(),
      type: z.string(),
      uploadedUrl: z.string().url(),
    }),
    required: true,
    fileConfig: {
      dragAndDrop: true,
      progressBar: true,
      uploadUrl: '/api/documents/upload',
      previewFormats: {
        image: true,
        pdf: true,
      },
      maxSize: 50 * 1024 * 1024,
      acceptedFormats: ['image/*', 'application/pdf'],
    },
  },
];

<DynamicForm
  fields={fields}
  record={{}}
  onSubmit={handleSubmit}
/>
```

---

## ✅ Implementación Completada

**Archivos creados:**
- `src/components/custom/form/inputs/types/file-upload-input.tsx`
- `example/app/examples/advanced/FileUploadForm.tsx`
- `docs/development/FILE_UPLOAD_EXAMPLE.md`

**Modificaciones realizadas:**
- `src/components/custom/form/inputs/base/input-types.ts` - Agregado FILE_UPLOAD enum
- `src/components/custom/form/inputs/input-factory.tsx` - Mapeo de FILE_UPLOAD
- `src/components/custom/form/inputs/types/index.ts` - Exportación del componente
- `example/app/examples-tabs.tsx` - Integración en pestaña de ejemplos
- `src/components/custom/form/inputs/base/definitions.ts` - Propiedades de FileConfig

**Tab en ejemplos:**
- 📁 File Upload en la página de ejemplos

---

**¡FILE_UPLOAD Input completamente implementado y listo para usar!** 📁✅
