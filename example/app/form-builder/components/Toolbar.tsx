'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRef } from 'react';

interface ToolbarProps {
  onExport: () => void;
  onImport: (json: string) => void;
  onClear: () => void;
  fieldsCount: number;
}

export function Toolbar({ onExport, onImport, onClear, fieldsCount }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      onImport(json);
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-b bg-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">🎨 Form Builder</h1>
        <span className="text-sm text-gray-500">
          {fieldsCount} {fieldsCount === 1 ? 'field' : 'fields'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleImportClick}
          title="Import form configuration from JSON file"
        >
          📥 Import
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={fieldsCount === 0}
          title="Export form configuration as JSON file"
        >
          📤 Export
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={fieldsCount === 0}
          title="Clear all fields"
        >
          🗑️ Clear
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
