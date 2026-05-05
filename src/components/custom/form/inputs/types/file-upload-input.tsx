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
import { FieldProps, FileConfig } from "../base/definitions";
import { UseFormReturn } from "react-hook-form";
import { CircleCheck, CircleX, Loader2, Upload, X, File as FileIcon, Image, Music, Video, FileText } from "lucide-react";
import { cn } from "@/src/lib/utils";

export class FileUploadInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return <FieldFileUpload input={input} form={form} isSubmitting={isSubmitting} />;
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

interface FileData {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  file?: globalThis.File;
  preview?: string;
  uploadProgress?: number;
  uploadedUrl?: string;
}

export const FieldFileUpload = ({ input, form, isSubmitting }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<FileData | null>(form.getValues(input.name) || null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const config: FileConfig | undefined = input.fileConfig;
  const {
    dragAndDrop = true,
    progressBar = true,
    uploadUrl,
    onUploadProgress,
    onUploadComplete,
    previewFormats = { image: true, video: false, audio: false, pdf: false },
    maxSize = 10 * 1024 * 1024, // 10MB default
    acceptedFormats = ['*'],
  } = config || {};

  const autoValidate = input.inputGroupConfig?.autoValidIcons;
  const iconValidState = <CircleCheck style={{ color: "#00bf3e" }} />;
  const iconInvalidState = <CircleX style={{ color: "#ff8080" }} />;
  const iconLoadingState = <Loader2 className="animate-spin" style={{ color: "#1e90ff" }} />;

  // Generate preview based on file type
  const generatePreview = (fileData: FileData) => {
    const type = fileData.type;

    if (previewFormats.image && type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      if (fileData.file) reader.readAsDataURL(fileData.file);
    } else if (previewFormats.video && type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      if (fileData.file) reader.readAsDataURL(fileData.file);
    } else if (previewFormats.audio && type.startsWith('audio/')) {
      setPreviewUrl('audio');
    } else if (previewFormats.pdf && type === 'application/pdf') {
      setPreviewUrl('pdf');
    }
  };

  const handleFileSelect = async (selectedFile: File) => {
    // Validate file size
    if (selectedFile.size > maxSize) {
      form.setError(input.name, {
        type: 'manual',
        message: `File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`,
      });
      return;
    }

    const fileData: FileData = {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      lastModified: selectedFile.lastModified,
      file: selectedFile,
      uploadProgress: 0,
    };

    setFile(fileData);
    form.setValue(input.name, fileData);
    generatePreview(fileData);

    // Auto-upload if uploadUrl is provided
    if (uploadUrl) {
      await handleUpload(fileData);
    }
  };

  const handleUpload = async (fileData: FileData) => {
    if (!uploadUrl || !fileData.file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', fileData.file);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
          onUploadProgress?.(percentComplete);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            fileData.uploadedUrl = response.url || response.data?.url;
            fileData.uploadProgress = 100;
            setUploadProgress(100);
            setFile({ ...fileData });
            form.setValue(input.name, fileData);
            onUploadComplete?.(response);
          } catch (e) {
            console.error('Failed to parse upload response', e);
          }
        }
      });

      xhr.addEventListener('error', () => {
        form.setError(input.name, {
          type: 'manual',
          message: 'Upload failed. Please try again.',
        });
        setUploading(false);
      });

      xhr.open('POST', uploadUrl);
      xhr.send(formData);
    } catch (error) {
      form.setError(input.name, {
        type: 'manual',
        message: 'Upload error. Please try again.',
      });
      setUploading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!dragAndDrop) return;
    event.preventDefault();
    setDragOver(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!dragAndDrop) return;
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    form.setValue(input.name, null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!file) return null;
    const type = file.type;
    if (type.startsWith('image/')) return <Image className="w-8 h-8" />;
    if (type.startsWith('video/')) return <Video className="w-8 h-8" />;
    if (type.startsWith('audio/')) return <Music className="w-8 h-8" />;
    if (type === 'application/pdf') return <FileText className="w-8 h-8" />;
    return <FileIcon className="w-8 h-8" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <FormField
      control={form.control}
      name={input.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={input.name}>
            {input.required && <span className="text-red-500 mr-1">*</span>}
            {input.label}
          </FormLabel>
          <FormControl>
            <div className="space-y-4">
              {/* Upload Area */}
              {!file || !file.uploadedUrl ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={cn(
                    "relative border-2 border-dashed rounded-lg p-8 transition-colors",
                    dragAndDrop ? "cursor-pointer" : "",
                    dragOver
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400",
                    uploading ? "opacity-50 pointer-events-none" : ""
                  )}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    onChange={handleInputChange}
                    className="hidden"
                    id={input.name}
                    disabled={uploading || isSubmitting}
                    accept={acceptedFormats.join(',')}
                  />

                  <div className="flex flex-col items-center justify-center gap-3">
                    {uploading ? (
                      <>
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-sm text-gray-600">Uploading...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">
                            {dragAndDrop 
                              ? "Drag and drop your file here, or click to select"
                              : "Click to select a file"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Max size: {formatFileSize(maxSize)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => inputRef.current?.click()}
                          className="mt-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                        >
                          Select File
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : null}

              {/* File Preview and Progress */}
              {file && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    {/* Preview or Icon */}
                    <div className="shrink-0">
                      {previewUrl && previewUrl !== 'audio' && previewUrl !== 'pdf' ? (
                        <img
                          src={previewUrl}
                          alt="preview"
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                          {getFileIcon()}
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatFileSize(file.size)}
                      </p>

                      {/* Progress Bar */}
                      {progressBar && file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(file.uploadProgress)}% uploaded
                          </p>
                        </div>
                      )}

                      {/* Success State */}
                      {file.uploadedUrl && (
                        <div className="flex items-center gap-2 mt-2">
                          <CircleCheck className="w-4 h-4 text-green-500" />
                          <p className="text-xs text-green-600">Upload complete</p>
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    {!uploading && (
                      <button
                        type="button"
                        onClick={handleRemove}
                        className="shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Error State */}
              {autoValidate && form.formState.errors[input.name] && (
                iconInvalidState
              )}
              {autoValidate && !form.formState.errors[input.name] && file && (
                iconValidState
              )}
            </div>
          </FormControl>
          {input.description && <FormDescription>{input.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
