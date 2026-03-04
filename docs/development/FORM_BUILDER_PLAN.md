# 🎨 Form Builder - Plan de Implementación

## 📋 Visión General

Un constructor visual de formularios con drag & drop que permite:
- Arrastrar inputs desde una paleta
- Configurar propiedades en un panel lateral
- Vista previa en tiempo real
- Exportar configuración JSON
- Importar formularios existentes

---

## 🎯 Características Principales

### 1. **Paleta de Componentes** (Sidebar Izquierdo)
```
┌─────────────────┐
│ 📦 INPUTS       │
├─────────────────┤
│ 📝 Text         │
│ 🔢 Number       │
│ 📧 Email        │
│ 📱 Phone        │
│ 🔗 URL          │
│ 🔒 Password     │
│ ⭐ Rating       │
│ 🎨 Color        │
│ 📅 Date         │
│ ⏰ Time         │
│ 📆 DateTime     │
│ 🔘 Radio        │
│ ☑️  Checkbox    │
│ 🔄 Switch       │
│ 📋 Select       │
│ 🔍 Autocomplete │
│ 📂 File         │
│ 🎯 Slider       │
│ 💰 Currency     │
│ 🔑 Key-Value    │
│ 🔁 Repeater     │
│ 📑 Tabs         │
└─────────────────┘
```

### 2. **Canvas Central** (Área de Construcción)
- Drop zone para arrastrar inputs
- Vista previa en tiempo real
- Reordenar campos con drag & drop
- Eliminar campos
- Duplicar campos
- Agrupar campos en filas/columnas

### 3. **Panel de Propiedades** (Sidebar Derecho)
```
┌─────────────────────────┐
│ ⚙️ PROPERTIES           │
├─────────────────────────┤
│ 📝 Basic                │
│   • Name                │
│   • Label               │
│   • Placeholder         │
│   • Description         │
│   • Default Value       │
│                         │
│ 🎨 Appearance           │
│   • Width               │
│   • Class Name          │
│   • Wrap in Card        │
│   • Icon Left           │
│   • Icon Right          │
│                         │
│ ✅ Validation           │
│   • Required            │
│   • Min Length          │
│   • Max Length          │
│   • Pattern             │
│   • Custom Validation   │
│                         │
│ 🔧 Advanced             │
│   • Conditional Display │
│   • Depends On          │
│   • Load Options        │
│   • onChange Handler    │
└─────────────────────────┘
```

### 4. **Barra de Herramientas Superior**
```
┌──────────────────────────────────────────────────┐
│ 💾 Save  📥 Import  📤 Export  👁️ Preview  🗑️ Clear │
└──────────────────────────────────────────────────┘
```

---

## 🏗️ Arquitectura Técnica

### Tecnologías a Usar

1. **@dnd-kit** (ya instalado) - Para drag & drop
2. **React State Management** - Para el estado del builder
3. **Monaco Editor** (opcional) - Para editar JSON
4. **React Hook Form** - Para el formulario de propiedades

### Estructura de Archivos

```
src/
├── components/
│   └── form-builder/
│       ├── FormBuilder.tsx           # Componente principal
│       ├── ComponentPalette.tsx      # Paleta de inputs
│       ├── Canvas.tsx                # Área de construcción
│       ├── PropertiesPanel.tsx       # Panel de propiedades
│       ├── Toolbar.tsx               # Barra de herramientas
│       ├── PreviewModal.tsx          # Modal de vista previa
│       ├── DraggableField.tsx        # Campo arrastrable
│       ├── DropZone.tsx              # Zona de drop
│       └── types.ts                  # Tipos TypeScript
│
example/app/
└── form-builder/
    └── page.tsx                      # Página del builder
```

---

## 📐 Diseño de Componentes

### 1. FormBuilder (Componente Principal)

```typescript
interface FormBuilderProps {
  initialFields?: FieldConfig[];
  onSave?: (fields: FieldConfig[]) => void;
  onExport?: (json: string) => void;
}

export const FormBuilder = ({
  initialFields = [],
  onSave,
  onExport
}: FormBuilderProps) => {
  const [fields, setFields] = useState<FieldConfig[]>(initialFields);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  return (
    <div className="flex h-screen">
      <ComponentPalette />
      <Canvas 
        fields={fields}
        onFieldsChange={setFields}
        selectedField={selectedField}
        onSelectField={setSelectedField}
      />
      <PropertiesPanel 
        field={fields.find(f => f.name === selectedField)}
        onUpdate={handleUpdateField}
      />
    </div>
  );
};
```

### 2. ComponentPalette

```typescript
const inputTypes = [
  { type: InputTypes.TEXT_GROUP, icon: '📝', label: 'Text' },
  { type: InputTypes.NUMBER, icon: '🔢', label: 'Number' },
  { type: InputTypes.EMAIL, icon: '📧', label: 'Email' },
  { type: InputTypes.PHONE, icon: '📱', label: 'Phone' },
  { type: InputTypes.URL, icon: '🔗', label: 'URL' },
  { type: InputTypes.PASSWORD, icon: '🔒', label: 'Password' },
  { type: InputTypes.RATING, icon: '⭐', label: 'Rating' },
  // ... más tipos
];

export const ComponentPalette = () => {
  return (
    <div className="w-64 border-r bg-gray-50 p-4">
      <h3 className="font-bold mb-4">Components</h3>
      <div className="space-y-2">
        {inputTypes.map((input) => (
          <DraggableInputType key={input.type} {...input} />
        ))}
      </div>
    </div>
  );
};
```

### 3. Canvas

```typescript
export const Canvas = ({
  fields,
  onFieldsChange,
  selectedField,
  onSelectField
}: CanvasProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    // Lógica para reordenar o agregar campos
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Form Canvas</h2>
          
          <SortableContext items={fields.map(f => f.name)}>
            {fields.length === 0 ? (
              <DropZone onDrop={handleAddField} />
            ) : (
              fields.map((field) => (
                <DraggableField
                  key={field.name}
                  field={field}
                  isSelected={selectedField === field.name}
                  onSelect={() => onSelectField(field.name)}
                  onDelete={() => handleDeleteField(field.name)}
                  onDuplicate={() => handleDuplicateField(field)}
                />
              ))
            )}
          </SortableContext>
        </div>
      </div>
    </DndContext>
  );
};
```

### 4. PropertiesPanel

```typescript
export const PropertiesPanel = ({ field, onUpdate }: PropertiesPanelProps) => {
  if (!field) {
    return (
      <div className="w-80 border-l bg-gray-50 p-4">
        <p className="text-gray-500">Select a field to edit properties</p>
      </div>
    );
  }

  return (
    <div className="w-80 border-l bg-gray-50 p-4 overflow-auto">
      <h3 className="font-bold mb-4">Properties</h3>
      
      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicProperties field={field} onUpdate={onUpdate} />
        </TabsContent>

        <TabsContent value="validation">
          <ValidationProperties field={field} onUpdate={onUpdate} />
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedProperties field={field} onUpdate={onUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
```

---

## 🎨 Características Avanzadas

### 1. **Agrupación de Campos**
```typescript
// Permitir agrupar campos en filas
{
  type: 'row',
  fields: [
    { name: 'firstName', ... },
    { name: 'lastName', ... }
  ]
}
```

### 2. **Plantillas Pre-configuradas**
```typescript
const templates = {
  login: [
    { name: 'email', inputType: InputTypes.EMAIL, ... },
    { name: 'password', inputType: InputTypes.PASSWORD, ... }
  ],
  registration: [...],
  profile: [...],
  contact: [...]
};
```

### 3. **Validación Visual**
- Mostrar errores de configuración
- Validar nombres únicos
- Validar dependencias entre campos

### 4. **Exportar/Importar**
```typescript
// Exportar como JSON
const exportJSON = () => {
  const config = {
    version: '1.35.0',
    fields: fields,
    metadata: {
      createdAt: new Date(),
      author: 'user'
    }
  };
  return JSON.stringify(config, null, 2);
};

// Importar desde JSON
const importJSON = (json: string) => {
  const config = JSON.parse(json);
  setFields(config.fields);
};
```

### 5. **Vista Previa en Tiempo Real**
```typescript
<PreviewModal open={previewMode} onClose={() => setPreviewMode(false)}>
  <DynamicForm
    formTitle="Preview"
    fields={fields}
    record={{}}
    onSubmit={(data) => console.log(data)}
  />
</PreviewModal>
```

---

## 📦 Dependencias Adicionales

```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",           // ✅ Ya instalado
    "@dnd-kit/sortable": "^10.0.0",      // ✅ Ya instalado
    "@dnd-kit/utilities": "^3.2.2",      // ✅ Ya instalado
    "react-icons": "^5.0.0",             // Para iconos
    "monaco-editor": "^0.45.0",          // Editor de código (opcional)
    "@monaco-editor/react": "^4.6.0"     // React wrapper (opcional)
  }
}
```

---

## 🚀 Plan de Implementación

### Fase 1: MVP (Mínimo Viable)
- [ ] Estructura básica del builder
- [ ] Paleta de componentes
- [ ] Canvas con drag & drop básico
- [ ] Panel de propiedades básicas (name, label, placeholder)
- [ ] Exportar JSON

### Fase 2: Propiedades Completas
- [ ] Todas las propiedades de FieldProps
- [ ] Validaciones
- [ ] Propiedades avanzadas
- [ ] Importar JSON

### Fase 3: Características Avanzadas
- [ ] Agrupación de campos
- [ ] Plantillas pre-configuradas
- [ ] Vista previa en tiempo real
- [ ] Duplicar campos
- [ ] Deshacer/Rehacer

### Fase 4: Pulido
- [ ] Atajos de teclado
- [ ] Responsive design
- [ ] Temas
- [ ] Exportar como código TypeScript
- [ ] Compartir formularios

---

## 💡 Ejemplo de Uso

```typescript
// En tu aplicación
import { FormBuilder } from 'shadcn-zod-formkit/builder';

export default function BuilderPage() {
  const handleSave = (fields: FieldConfig[]) => {
    // Guardar en base de datos
    console.log('Saving fields:', fields);
  };

  const handleExport = (json: string) => {
    // Descargar archivo
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-config.json';
    a.click();
  };

  return (
    <FormBuilder
      onSave={handleSave}
      onExport={handleExport}
    />
  );
}
```

---

## 🎯 Resultado Final

El usuario podrá:

1. **Arrastrar** inputs desde la paleta al canvas
2. **Configurar** cada input con todas sus propiedades
3. **Reordenar** campos con drag & drop
4. **Agrupar** campos en filas/columnas
5. **Vista previa** del formulario en tiempo real
6. **Exportar** la configuración como JSON
7. **Importar** formularios existentes
8. **Usar plantillas** pre-configuradas
9. **Copiar código** TypeScript generado

---

## 📊 Estimación de Tiempo

- **Fase 1 (MVP)**: 2-3 días
- **Fase 2 (Propiedades)**: 2-3 días
- **Fase 3 (Avanzado)**: 3-4 días
- **Fase 4 (Pulido)**: 2-3 días

**Total**: ~10-13 días de desarrollo

---

## 🎨 Mockup Visual

```
┌────────────────────────────────────────────────────────────────┐
│  💾 Save  📥 Import  📤 Export  👁️ Preview  🗑️ Clear           │
├──────────┬──────────────────────────────────┬──────────────────┤
│          │                                  │                  │
│ 📦 INPUTS│         FORM CANVAS              │  ⚙️ PROPERTIES   │
│          │                                  │                  │
│ 📝 Text  │  ┌────────────────────────────┐  │  📝 Basic        │
│ 🔢 Number│  │ 📝 Username                │  │  • Name: username│
│ 📧 Email │  │ [john_doe____________]     │  │  • Label: User.. │
│ 📱 Phone │  └────────────────────────────┘  │  • Placeholder:..│
│ 🔗 URL   │                                  │                  │
│ 🔒 Pass  │  ┌────────────────────────────┐  │  ✅ Validation   │
│ ⭐ Rating│  │ 📧 Email                   │  │  • Required: ✓   │
│ 🎨 Color │  │ [user@example.com_____]    │  │  • Min: 3        │
│ 📅 Date  │  └────────────────────────────┘  │  • Max: 20       │
│ ...      │                                  │                  │
│          │  ┌────────────────────────────┐  │  🔧 Advanced     │
│          │  │ 🔒 Password                │  │  • Show Strength │
│          │  │ [••••••••••••••]           │  │  • Requirements  │
│          │  └────────────────────────────┘  │                  │
│          │                                  │                  │
│          │  [+ Drop here to add field]     │                  │
│          │                                  │                  │
└──────────┴──────────────────────────────────┴──────────────────┘
```

---

¿Quieres que empiece a implementar el Form Builder? 🚀
