'use client'

import { useState, useMemo, useCallback } from 'react';
import { FieldProps, DynamicForm } from 'shadcn-zod-formkit';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface PreviewPanelProps {
  fields: FieldProps<any>[];
}

// Hoist static JSX outside component
const EmptyState = () => (
  <div className="h-full flex items-center justify-center bg-gray-50">
    <div className="text-center text-gray-400 max-w-md">
      <div className="text-6xl mb-4">👁️</div>
      <h3 className="text-xl font-semibold mb-2">No Preview Available</h3>
      <p className="text-sm">
        Switch to the Builder tab and add some fields to see the preview
      </p>
    </div>
  </div>
);

const InfoAlert = () => (
  <Alert className="mb-6">
    <Info className="h-4 w-4" />
    <AlertDescription>
      This is a live preview. Changes made in the Builder tab will appear here instantly.
    </AlertDescription>
  </Alert>
);

export function PreviewPanel({ fields }: PreviewPanelProps) {
  const [formData, setFormData] = useState<any>({});

  // Memoize record creation
  const record = useMemo(() => {
    const rec: Record<string, any> = {};
    fields.forEach(field => {
      const fieldName = field.name as string;
      rec[fieldName] = field.defaultValue ?? '';
    });
    return rec;
  }, [fields]);

  // Memoize fields count
  const fieldsCount = useMemo(() => fields.length, [fields.length]);

  // Memoize JSON strings
  const formDataJson = useMemo(
    () => JSON.stringify(formData, null, 2) || '{}',
    [formData]
  );

  const fieldsConfigJson = useMemo(
    () => JSON.stringify(fields, null, 2),
    [fields]
  );

  // Stable callback
  const handleSubmit = useCallback(({ data }: { data: any }) => {
    setFormData(data);
    console.log('📤 Form submitted:', data);
  }, []);

  if (fieldsCount === 0) {
    return <EmptyState />;
  }

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Form Preview</h2>
          <p className="text-sm text-gray-600">
            This is how your form will look when rendered
          </p>
        </div>

        <InfoAlert />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Live Form</h3>
            <DynamicForm
              formTitle="Preview Form"
              formSubTitle="Test your form configuration"
              withCard
              fields={fields}
              record={record}
              errorAlertPosition="down"
              onSubmit={handleSubmit}
            />
          </div>

          {/* Form Data Output */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Form Data</h3>
            <Card className="p-4">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-gray-700">
                  Submitted Data
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  Fill out the form and click submit to see the data here
                </div>
                <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded-md overflow-auto max-h-[600px] font-mono">
                  <code>{formDataJson}</code>
                </pre>
              </div>
            </Card>

            {/* Field Configuration */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Configuration</h3>
              <Card className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium text-gray-700">
                    Fields Configuration ({fieldsCount} fields)
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    This is the JSON configuration for your form
                  </div>
                  <pre className="text-xs bg-gray-900 text-blue-400 p-4 rounded-md overflow-auto max-h-[400px] font-mono">
                    <code>{fieldsConfigJson}</code>
                  </pre>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
