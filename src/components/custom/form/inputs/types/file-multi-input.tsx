'use client'

import { JSX, useRef, useState } from "react";
import { BaseInput } from "../base/base-input";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/src/components/ui/form";
import { FieldProps } from "../base/definitions";
import { UseFormReturn } from "react-hook-form";
import { CircleCheck, CircleX, Loader2, Upload } from "lucide-react";
import { cn } from "@/src/lib/utils";

export class FileMultiUploadInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return <FieldFileMultiUpload input={input} form={form} isSubmitting={isSubmitting} />;
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

export const FieldFileMultiUpload = ({ input, form, isSubmitting }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>(form.getValues(input.name) || []);
  const [dragOver, setDragOver] = useState(false);

  const autoValidate = input.inputGroupConfig?.autoValidIcons;
  const iconValidState = <CircleCheck style={{ color: "#00bf3e" }} />;
  const iconInvalidState = <CircleX style={{ color: "#ff8080" }} />;
  const iconLoadingState = <Loader2 className="animate-spin" style={{ color: "#1e90ff" }} />;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
    setFiles(selectedFiles);
    form.setValue(input.name, selectedFiles);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files ? Array.from(event.dataTransfer.files) : [];
    const updatedFiles = [...files, ...droppedFiles];
    setFiles(updatedFiles);
    form.setValue(input.name, updatedFiles);
    setDragOver(false);
  };

  return (
    <FormField
      key={input.name}
      control={form.control}
      name={input.name}
      render={({ field, fieldState }) => {
        const isValid = !fieldState.error && files.length > 0;

        return (
          <FormItem className={input.className}>
            <FormLabel><b>{input.label}</b></FormLabel>

            <FormControl>
              <div
                ref={inputRef}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={cn(
                  "w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
                  dragOver ? "border-blue-500 bg-blue-50" : "border-gray-400 bg-gray-50",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              >
                <Upload className="w-10 h-10 text-gray-500 mb-2" />
                <span className="text-gray-600 text-sm text-center px-2">
                  {files.length === 0 
                    ? "Arrastra tus archivos aquí o haz click para seleccionar" 
                    : `${files.length} archivo(s) seleccionados`}
                </span>
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  className="hidden"
                  disabled={input.disabled || isSubmitting}
                  onChange={handleFileSelect}
                />
              </div>
            </FormControl>

            {/* Lista de archivos seleccionados */}
            {files.length > 0 && (
              <ul className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                {files.map((f, idx) => (
                  <li key={idx} className="flex justify-between items-center py-1 px-2 rounded hover:bg-gray-100">
                    <span className="truncate">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const filtered = files.filter((_, i) => i !== idx);
                        setFiles(filtered);
                        form.setValue(input.name, filtered);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {input.description && <FormDescription>{input.description}</FormDescription>}

            {autoValidate && (
              <div className="mt-1">
                {isSubmitting
                  ? iconLoadingState
                  : isValid
                  ? iconValidState
                  : iconInvalidState}
              </div>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
