'use client'

import { useState } from 'react';
import { FieldProps, InputTypes } from 'shadcn-zod-formkit';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ConditionalLogicEditor } from './ConditionalLogicEditor';

interface PropertiesPanelProps {
  field?: FieldProps<any>;
  allFields: FieldProps<any>[];
  onUpdate: (field: FieldProps<any>) => void;
}

export function PropertiesPanel({ field, allFields, onUpdate }: PropertiesPanelProps) {
  const [showConditionalEditor, setShowConditionalEditor] = useState(false);

  if (!field) {
    return (
      <div className="w-80 border-l bg-gray-50 p-4">
        <div className="text-center text-gray-400 mt-8">
          <div className="text-4xl mb-2">⚙️</div>
          <p className="font-medium">Ningún campo seleccionado</p>
          <p className="text-sm mt-1">Haz clic en un campo para editar sus propiedades</p>
        </div>
      </div>
    );
  }

  const updateField = (updates: Partial<FieldProps<any>>) => {
    onUpdate({ ...field, ...updates } as FieldProps<any>);
  };

  const handleConditionalLogicUpdate = (showWhenCode: string) => {
    if (showWhenCode) {
      // Crear función desde string
      try {
        const showWhenFn = eval(showWhenCode);
        updateField({ showWhen: showWhenFn });
      } catch (error) {
        console.error('Error al crear función showWhen:', error);
      }
    } else {
      updateField({ showWhen: undefined });
    }
  };

  // Obtener otros campos para dependencias (excluyendo el actual)
  const otherFields = allFields.filter(f => f.name !== field.name);

  // Clasificar propiedades por tipo de input
  const inputType = field.inputType as InputTypes;

  return (
    <div className="w-96 border-l bg-gray-50 overflow-auto">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-lg">⚙️ Propiedades</h3>
          <Badge variant="outline">{inputType}</Badge>
        </div>
        <p className="text-xs text-gray-500">Configura las opciones del campo</p>
      </div>

      <Tabs defaultValue="basic" className="p-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          <TabsTrigger value="behavior">Comportamiento</TabsTrigger>
        </TabsList>

        {/* BASIC TAB */}
        <TabsContent value="basic" className="space-y-4 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label>Nombre del Campo *</Label>
            <Input
              value={field.name as string}
              onChange={(e) => updateField({ name: e.target.value })}
              placeholder="nombre_campo"
            />
            <p className="text-xs text-gray-500">Identificador único para este campo</p>
          </div>

          {/* Label */}
          <div className="space-y-2">
            <Label>Etiqueta *</Label>
            <Input
              value={field.label}
              onChange={(e) => updateField({ label: e.target.value })}
              placeholder="Etiqueta del Campo"
            />
          </div>

          {/* Placeholder */}
          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Input
              value={field.placeHolder || ''}
              onChange={(e) => updateField({ placeHolder: e.target.value })}
              placeholder="Ingresa un placeholder..."
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea
              value={field.description || ''}
              onChange={(e) => updateField({ description: e.target.value })}
              placeholder="Texto de ayuda para este campo"
              rows={2}
            />
          </div>

          {/* Default Value */}
          <div className="space-y-2">
            <Label>Valor por Defecto</Label>
            <Input
              value={field.defaultValue || ''}
              onChange={(e) => updateField({ defaultValue: e.target.value })}
              placeholder="Valor por defecto..."
            />
          </div>

          <Separator />

          {/* Required */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Requerido</Label>
              <p className="text-xs text-gray-500">El campo debe ser llenado</p>
            </div>
            <Switch
              checked={field.required || false}
              onCheckedChange={(checked) => updateField({ required: checked })}
            />
          </div>

          {/* Disabled */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Deshabilitado</Label>
              <p className="text-xs text-gray-500">El campo es solo lectura</p>
            </div>
            <Switch
              checked={field.disabled || false}
              onCheckedChange={(checked) => updateField({ disabled: checked })}
            />
          </div>

          {/* Hidden */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Oculto</Label>
              <p className="text-xs text-gray-500">Ocultar campo de la vista</p>
            </div>
            <Switch
              checked={field.hidden || false}
              onCheckedChange={(checked) => updateField({ hidden: checked })}
            />
          </div>
        </TabsContent>

        {/* ADVANCED TAB */}
        <TabsContent value="advanced" className="space-y-4 mt-4">
          <h4 className="font-semibold text-sm text-gray-700">Propiedades Específicas del Input</h4>
          
          {/* TEXT & TEXT_GROUP */}
          {(inputType === InputTypes.TEXT || inputType === InputTypes.TEXT_GROUP || inputType === InputTypes.TEXTAREA) && (
            <>
              <div className="space-y-2">
                <Label>Longitud Máxima</Label>
                <Input
                  type="number"
                  value={field.maxLength || ''}
                  onChange={(e) => updateField({ maxLength: parseInt(e.target.value) || undefined })}
                  placeholder="Máximo de caracteres"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Mostrar Contador de Caracteres</Label>
                <Switch
                  checked={field.showCharCount || false}
                  onCheckedChange={(checked) => updateField({ showCharCount: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Limpiable</Label>
                <Switch
                  checked={field.clearable || false}
                  onCheckedChange={(checked) => updateField({ clearable: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Copiable</Label>
                <Switch
                  checked={field.copyable || false}
                  onCheckedChange={(checked) => updateField({ copyable: checked })}
                />
              </div>
            </>
          )}

          {/* NUMBER */}
          {inputType === InputTypes.NUMBER && (
            <>
              <div className="space-y-2">
                <Label>Valor Mínimo</Label>
                <Input
                  type="number"
                  value={field.min ?? ''}
                  onChange={(e) => updateField({ min: parseFloat(e.target.value) || undefined })}
                  placeholder="Valor mínimo"
                />
              </div>

              <div className="space-y-2">
                <Label>Valor Máximo</Label>
                <Input
                  type="number"
                  value={field.max ?? ''}
                  onChange={(e) => updateField({ max: parseFloat(e.target.value) || undefined })}
                  placeholder="Valor máximo"
                />
              </div>

              <div className="space-y-2">
                <Label>Incremento</Label>
                <Input
                  type="number"
                  value={field.step ?? ''}
                  onChange={(e) => updateField({ step: parseFloat(e.target.value) || undefined })}
                  placeholder="Incremento"
                />
              </div>
            </>
          )}

          {/* RATING */}
          {inputType === InputTypes.RATING && (
            <>
              <div className="space-y-2">
                <Label>Máximo de Estrellas</Label>
                <Input
                  type="number"
                  value={field.max || 5}
                  onChange={(e) => updateField({ max: parseInt(e.target.value) })}
                  min={1}
                  max={10}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Mostrar Valor</Label>
                <Switch
                  checked={field.showValue || false}
                  onCheckedChange={(checked) => updateField({ showValue: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Permitir Medias Estrellas</Label>
                <Switch
                  checked={field.allowHalf || false}
                  onCheckedChange={(checked) => updateField({ allowHalf: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Tamaño</Label>
                <Select
                  value={field.size || 'md'}
                  onValueChange={(value) => updateField({ size: value as 'sm' | 'md' | 'lg' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Pequeño</SelectItem>
                    <SelectItem value="md">Mediano</SelectItem>
                    <SelectItem value="lg">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* PHONE */}
          {inputType === InputTypes.PHONE && (
            <div className="space-y-2">
              <Label>Código de País por Defecto</Label>
              <Input
                value={field.defaultCountryCode || '+1'}
                onChange={(e) => updateField({ defaultCountryCode: e.target.value })}
                placeholder="+1"
              />
            </div>
          )}

          {/* PASSWORD */}
          {inputType === InputTypes.PASSWORD && (
            <>
              <div className="flex items-center justify-between">
                <Label>Mostrar Indicador de Fortaleza</Label>
                <Switch
                  checked={field.showStrength || false}
                  onCheckedChange={(checked) => updateField({ showStrength: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Mostrar Requisitos</Label>
                <Switch
                  checked={field.showRequirements || false}
                  onCheckedChange={(checked) => updateField({ showRequirements: checked })}
                />
              </div>
            </>
          )}

          {/* URL */}
          {inputType === InputTypes.URL && (
            <>
              <div className="flex items-center justify-between">
                <Label>Mostrar Vista Previa</Label>
                <Switch
                  checked={field.showPreview !== false}
                  onCheckedChange={(checked) => updateField({ showPreview: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Agregar Protocolo Automáticamente</Label>
                <Switch
                  checked={field.autoProtocol !== false}
                  onCheckedChange={(checked) => updateField({ autoProtocol: checked })}
                />
              </div>
            </>
          )}

          {/* SLIDER */}
          {inputType === InputTypes.SLIDER && (
            <>
              <div className="space-y-2">
                <Label>Valor Mínimo</Label>
                <Input
                  type="number"
                  value={field.min ?? 0}
                  onChange={(e) => updateField({ min: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>Valor Máximo</Label>
                <Input
                  type="number"
                  value={field.max ?? 100}
                  onChange={(e) => updateField({ max: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>Incremento</Label>
                <Input
                  type="number"
                  value={field.step ?? 1}
                  onChange={(e) => updateField({ step: parseFloat(e.target.value) })}
                />
              </div>
            </>
          )}

          {/* FILE & FILE_MULTI_UPLOAD */}
          {(inputType === InputTypes.FILE || inputType === InputTypes.FILE_MULTI_UPLOAD) && (
            <>
              <div className="space-y-2">
                <Label>Accepted File Types</Label>
                <Input
                  value={field.fileConfig?.accept || ''}
                  onChange={(e) => updateField({ 
                    fileConfig: { 
                      ...field.fileConfig,
                      accept: e.target.value,
                      multiple: field.fileConfig?.multiple || false,
                      maxSize: field.fileConfig?.maxSize || 5242880
                    } 
                  })}
                  placeholder="image/*,.pdf"
                />
                <p className="text-xs text-gray-500">e.g., image/*,.pdf,.doc</p>
              </div>

              <div className="space-y-2">
                <Label>Max File Size (bytes)</Label>
                <Input
                  type="number"
                  value={field.fileConfig?.maxSize || 5242880}
                  onChange={(e) => updateField({ 
                    fileConfig: { 
                      ...field.fileConfig,
                      accept: field.fileConfig?.accept || '*',
                      multiple: field.fileConfig?.multiple || false,
                      maxSize: parseInt(e.target.value)
                    } 
                  })}
                />
                <p className="text-xs text-gray-500">Default: 5MB (5242880 bytes)</p>
              </div>

              <div className="flex items-center justify-between">
                <Label>Show Preview</Label>
                <Switch
                  checked={field.fileConfig?.showPreview !== false}
                  onCheckedChange={(checked) => updateField({ 
                    fileConfig: { 
                      ...field.fileConfig,
                      accept: field.fileConfig?.accept || '*',
                      multiple: field.fileConfig?.multiple || false,
                      maxSize: field.fileConfig?.maxSize || 5242880,
                      showPreview: checked
                    } 
                  })}
                />
              </div>
            </>
          )}

          <Separator className="my-4" />

          {/* Common Advanced Properties */}
          <h4 className="font-semibold text-sm text-gray-700">Styling & Layout</h4>

          <div className="space-y-2">
            <Label>CSS Class Name</Label>
            <Input
              value={field.className || ''}
              onChange={(e) => updateField({ className: e.target.value })}
              placeholder="custom-class"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Wrap in Card</Label>
            <Switch
              checked={field.wrapInCard || false}
              onCheckedChange={(checked) => updateField({ wrapInCard: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>Info Tooltip</Label>
            <Input
              value={field.infoTooltip || ''}
              onChange={(e) => updateField({ infoTooltip: e.target.value })}
              placeholder="Tooltip text"
            />
          </div>

          <div className="space-y-2">
            <Label>Help Text</Label>
            <Textarea
              value={field.helpText || ''}
              onChange={(e) => updateField({ helpText: e.target.value })}
              placeholder="Expandable help text"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Help Link</Label>
            <Input
              value={field.helpLink || ''}
              onChange={(e) => updateField({ helpLink: e.target.value })}
              placeholder="https://docs.example.com"
            />
          </div>
        </TabsContent>

        {/* BEHAVIOR TAB */}
        <TabsContent value="behavior" className="space-y-4 mt-4">
          <h4 className="font-semibold text-sm text-gray-700">Visualización Condicional</h4>

          {/* Conditional Logic Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Lógica Condicional (showWhen)</Label>
              <Switch
                checked={showConditionalEditor}
                onCheckedChange={setShowConditionalEditor}
              />
            </div>
            <p className="text-xs text-gray-500">
              Define cuándo mostrar este campo basado en otros campos
            </p>
          </div>

          {showConditionalEditor && (
            <ConditionalLogicEditor
              field={field}
              allFields={allFields}
              onUpdate={handleConditionalLogicUpdate}
            />
          )}

          <Separator className="my-4" />

          {/* Depends On */}
          <div className="space-y-2">
            <Label>Depende del Campo (dependsOn)</Label>
            <Select
              value={field.dependsOn || 'none'}
              onValueChange={(value) => updateField({ dependsOn: value === 'none' ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un campo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ninguno (Independiente)</SelectItem>
                {otherFields.map((f) => (
                  <SelectItem key={f.name as string} value={f.name as string}>
                    {f.label} ({f.name as string})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Este campo dependerá del valor del campo seleccionado
            </p>
          </div>

          {field.dependsOn && (
            <Card className="p-3 bg-blue-50 border-blue-200">
              <p className="text-xs text-blue-800">
                💡 Este campo depende de <strong>{field.dependsOn}</strong>. 
                Puedes usar <code>loadOptions</code> para cargar opciones dinámicamente.
              </p>
            </Card>
          )}

          <Separator className="my-4" />

          <h4 className="font-semibold text-sm text-gray-700">Validation</h4>

          <div className="flex items-center justify-between">
            <div>
              <Label>Validate on Blur</Label>
              <p className="text-xs text-gray-500">Validate when field loses focus</p>
            </div>
            <Switch
              checked={field.validateOnBlur || false}
              onCheckedChange={(checked) => updateField({ validateOnBlur: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Validate on Change</Label>
              <p className="text-xs text-gray-500">Validate on every keystroke</p>
            </div>
            <Switch
              checked={field.validateOnChange || false}
              onCheckedChange={(checked) => updateField({ validateOnChange: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Valid Icon</Label>
              <p className="text-xs text-gray-500">Show ✓ when valid</p>
            </div>
            <Switch
              checked={field.showValidIcon || false}
              onCheckedChange={(checked) => updateField({ showValidIcon: checked })}
            />
          </div>

          <Separator className="my-4" />

          <h4 className="font-semibold text-sm text-gray-700">Performance</h4>

          <div className="space-y-2">
            <Label>Debounce (ms)</Label>
            <Input
              type="number"
              value={field.debounce || ''}
              onChange={(e) => updateField({ debounce: parseInt(e.target.value) || undefined })}
              placeholder="300"
            />
            <p className="text-xs text-gray-500">Delay before onChange fires</p>
          </div>

          <div className="space-y-2">
            <Label>Validation Debounce (ms)</Label>
            <Input
              type="number"
              value={field.debounceValidation || ''}
              onChange={(e) => updateField({ debounceValidation: parseInt(e.target.value) || undefined })}
              placeholder="500"
            />
            <p className="text-xs text-gray-500">Delay before async validation</p>
          </div>

          <Separator className="my-4" />

          <h4 className="font-semibold text-sm text-gray-700">Accessibility</h4>

          <div className="space-y-2">
            <Label>ARIA Label</Label>
            <Input
              value={field.ariaLabel || ''}
              onChange={(e) => updateField({ ariaLabel: e.target.value })}
              placeholder="Accessible label"
            />
          </div>

          <div className="space-y-2">
            <Label>ARIA Described By</Label>
            <Input
              value={field.ariaDescribedBy || ''}
              onChange={(e) => updateField({ ariaDescribedBy: e.target.value })}
              placeholder="description-id"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>ARIA Required</Label>
            <Switch
              checked={field.ariaRequired || false}
              onCheckedChange={(checked) => updateField({ ariaRequired: checked })}
            />
          </div>
        </TabsContent>
      </Tabs>

      <Card className="m-4 p-3 bg-yellow-50 border-yellow-200">
        <p className="text-xs text-yellow-800">
          💡 <strong>Tip:</strong> Changes are applied instantly. Switch to Preview tab to test!
        </p>
      </Card>
    </div>
  );
}
