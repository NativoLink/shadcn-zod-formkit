'use client'

import { useState, useMemo, useCallback } from 'react';
import { FieldProps } from 'shadcn-zod-formkit';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Code, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Operator = 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan' | 'greaterOrEqual' | 'lessOrEqual' | 'isEmpty' | 'isNotEmpty';
type LogicOperator = 'AND' | 'OR';

interface ConditionalRule {
  id: string;
  field: string;
  operator: Operator;
  value: any;
}

interface ConditionalLogicEditorProps {
  field: FieldProps<any>;
  allFields: FieldProps<any>[];
  onUpdate: (showWhenCode: string) => void;
}

// Hoisted static data (rendering-hoist-jsx)
const OPERATOR_LABELS: Record<Operator, string> = {
  equals: 'Es igual a',
  notEquals: 'No es igual a',
  contains: 'Contiene',
  notContains: 'No contiene',
  greaterThan: 'Mayor que',
  lessThan: 'Menor que',
  greaterOrEqual: 'Mayor o igual que',
  lessOrEqual: 'Menor o igual que',
  isEmpty: 'Está vacío',
  isNotEmpty: 'No está vacío'
};

const EMPTY_STATE_JSX = (
  <div className="text-center py-8 text-gray-400">
    <div className="text-4xl mb-2">🎯</div>
    <p className="text-sm">No hay reglas definidas</p>
    <p className="text-xs mt-1">El campo siempre será visible</p>
  </div>
);

export function ConditionalLogicEditor({ field, allFields, onUpdate }: ConditionalLogicEditorProps) {
  const [rules, setRules] = useState<ConditionalRule[]>([]);
  const [logicOperator, setLogicOperator] = useState<LogicOperator>('AND');
  const [showPreview, setShowPreview] = useState(false);

  // Memoize derived values (rerender-derived-state)
  const otherFields = useMemo(
    () => allFields.filter(f => f.name !== field.name),
    [allFields, field.name]
  );

  const hasRules = rules.length > 0;
  const hasOtherFields = otherFields.length > 0;

  // Memoize callbacks (rerender-functional-setstate)
  const addRule = useCallback(() => {
    const newRule: ConditionalRule = {
      id: `rule_${Date.now()}`,
      field: otherFields[0]?.name as string || '',
      operator: 'equals',
      value: ''
    };
    setRules(prev => [...prev, newRule]);
  }, [otherFields]);

  const updateRule = useCallback((id: string, updates: Partial<ConditionalRule>) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
  }, []);

  const deleteRule = useCallback((id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
  }, []);

  const generateCode = useCallback((): string => {
    if (rules.length === 0) return '';

    const conditions = rules.map(rule => {
      const fieldName = rule.field;
      const value = typeof rule.value === 'string' ? `"${rule.value}"` : rule.value;

      switch (rule.operator) {
        case 'equals':
          return `values.${fieldName} === ${value}`;
        case 'notEquals':
          return `values.${fieldName} !== ${value}`;
        case 'contains':
          return `values.${fieldName}?.toString().includes(${value})`;
        case 'notContains':
          return `!values.${fieldName}?.toString().includes(${value})`;
        case 'greaterThan':
          return `values.${fieldName} > ${value}`;
        case 'lessThan':
          return `values.${fieldName} < ${value}`;
        case 'greaterOrEqual':
          return `values.${fieldName} >= ${value}`;
        case 'lessOrEqual':
          return `values.${fieldName} <= ${value}`;
        case 'isEmpty':
          return `!values.${fieldName} || values.${fieldName} === ""`;
        case 'isNotEmpty':
          return `values.${fieldName} && values.${fieldName} !== ""`;
        default:
          return `values.${fieldName} === ${value}`;
      }
    });

    const operator = logicOperator === 'AND' ? ' && ' : ' || ';
    return `(values) => ${conditions.join(operator)}`;
  }, [rules, logicOperator]);

  const applyRules = useCallback(() => {
    const code = generateCode();
    onUpdate(code);
  }, [generateCode, onUpdate]);

  const clearRules = useCallback(() => {
    setRules([]);
    onUpdate('');
  }, [onUpdate]);

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-sm">Editor de Lógica Condicional</h4>
          <p className="text-xs text-gray-500">Define cuándo mostrar este campo</p>
        </div>
        <Badge variant={hasRules ? 'default' : 'outline'}>
          {rules.length} {rules.length === 1 ? 'regla' : 'reglas'}
        </Badge>
      </div>

      {!hasRules ? (
        EMPTY_STATE_JSX
      ) : (
        <>
          {/* Logic Operator */}
          {rules.length > 1 && (
            <div className="flex items-center gap-2">
              <Label className="text-xs">Operador lógico:</Label>
              <Select value={logicOperator} onValueChange={(value) => setLogicOperator(value as LogicOperator)}>
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">Y (AND)</SelectItem>
                  <SelectItem value="OR">O (OR)</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-gray-500">
                {logicOperator === 'AND' ? 'Todas las reglas deben cumplirse' : 'Al menos una regla debe cumplirse'}
              </span>
            </div>
          )}

          <Separator />

          {/* Rules */}
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <Card key={rule.id} className="p-3 bg-gray-50">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    {/* Rule number */}
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Regla {index + 1}
                      </Badge>
                      {index > 0 && (
                        <span className="text-xs font-medium text-blue-600">
                          {logicOperator}
                        </span>
                      )}
                    </div>

                    {/* Field selector */}
                    <div className="space-y-1">
                      <Label className="text-xs">Campo</Label>
                      <Select
                        value={rule.field}
                        onValueChange={(value) => updateRule(rule.id, { field: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {otherFields.map((f) => (
                            <SelectItem key={f.name as string} value={f.name as string}>
                              {f.label} ({f.name as string})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Operator selector */}
                    <div className="space-y-1">
                      <Label className="text-xs">Operador</Label>
                      <Select
                        value={rule.operator}
                        onValueChange={(value) => updateRule(rule.id, { operator: value as Operator })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(OPERATOR_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Value input (only if operator needs a value) */}
                    {!['isEmpty', 'isNotEmpty'].includes(rule.operator) && (
                      <div className="space-y-1">
                        <Label className="text-xs">Valor</Label>
                        <Input
                          className="h-8"
                          value={rule.value}
                          onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                          placeholder="Ingresa un valor..."
                        />
                      </div>
                    )}
                  </div>

                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <Separator />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={addRule}
          disabled={!hasOtherFields}
        >
          <Plus className="h-4 w-4 mr-1" />
          Agregar Regla
        </Button>

        {hasRules && (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={applyRules}
            >
              <Eye className="h-4 w-4 mr-1" />
              Aplicar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearRules}
            >
              Limpiar Todo
            </Button>

            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Code className="h-4 w-4 mr-1" />
                  Ver Código
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Código Generado</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                    Este código se usará en la propiedad <code>showWhen</code>
                  </p>
                  <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded-md overflow-auto">
                    <code>{generateCode()}</code>
                  </pre>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      {/* Info */}
      {!hasOtherFields && (
        <Card className="p-3 bg-yellow-50 border-yellow-200">
          <p className="text-xs text-yellow-800">
            ⚠️ No hay otros campos disponibles para crear reglas. Agrega más campos primero.
          </p>
        </Card>
      )}

      {hasRules && (
        <Card className="p-3 bg-blue-50 border-blue-200">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Haz clic en "Aplicar" para guardar las reglas. 
            Luego ve al tab Preview para probar la lógica condicional.
          </p>
        </Card>
      )}
    </Card>
  );
}
