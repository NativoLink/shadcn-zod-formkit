'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DynamicForm, FieldConfig, InputTypes } from 'shadcn-zod-formkit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'


interface IFileUploadForm {
  document: {
    name: string;
    size: number;
    type: string;
    uploadedUrl?: string
  };
  profileImage: {
    name: string;
    size: number;
    type: string;
    uploadedUrl?: string
  };
  attachment: {
    name: string;
    size: number;
    type: string;
    uploadedUrl?: string
  };
  
}

// Define validation schema
const fileUploadSchema = z.object({
  document: z.object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
    uploadedUrl: z.string().url().optional(),
  }).optional(),
  profileImage: z.object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
    uploadedUrl: z.string().url().optional(),
  }),
  attachment: z.object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
    uploadedUrl: z.string().url().optional(),
  }).optional(),
})

type FileUploadFormData = z.infer<typeof fileUploadSchema>

export default function FileUploadForm() {
  const [submitted, setSubmitted] = useState<FileUploadFormData | null>(null)

  const form = useForm<FileUploadFormData>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      document: undefined,
      profileImage: undefined,
      attachment: undefined,
    },
  })

  const onSubmit = async (data: FileUploadFormData) => {
    console.log('Form submitted:', data)
    setSubmitted(data)
  }
  const record: IFileUploadForm = {
    document: {
      name: "",
      size: 0,
      type: "",
      uploadedUrl: undefined
    },
    profileImage: {
      name: "",
      size: 0,
      type: "",
      uploadedUrl: undefined
    },
    attachment: {
      name: "",
      size: 0,
      type: "",
      uploadedUrl: undefined
    }
  };

  const fields: FieldConfig<IFileUploadForm> = [
    {
      name: 'profileImage',
      label: 'Profile Picture',
      inputType: InputTypes.FILE_UPLOAD,
      required: true,
      fileConfig: {
        dragAndDrop: true,
        progressBar: true,
        previewFormats: {
          image: true,
          video: false,
          audio: false,
          pdf: false,
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        acceptedFormats: ['image/*'],
        accept: '',
        multiple: false
      },
    },
    {
      name: 'document',
      label: 'Document (PDF or Image)',
      inputType: InputTypes.FILE_UPLOAD,
      required: false,
      description: 'Upload a document in PDF or image format',
      fileConfig: {
        dragAndDrop: true,
        progressBar: true,
        previewFormats: {
          image: true,
          video: false,
          audio: false,
          pdf: true,
        },
        maxSize: 10 * 1024 * 1024, // 10MB
        acceptedFormats: ['image/*', 'application/pdf'],
        accept: '',
        multiple: false
      },
    },
    {
      name: 'attachment',
      label: 'Additional Attachment',
      inputType: InputTypes.FILE_UPLOAD,
      required: false,
      description: 'Upload any additional file',
      fileConfig: {
        dragAndDrop: true,
        progressBar: true,
        previewFormats: {
          image: true,
          video: false,
          audio: false,
          pdf: true,
        },
        maxSize: 20 * 1024 * 1024,
        accept: '',
        multiple: false
      },
    },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>📁 File Upload Input</CardTitle>
          <CardDescription>
            Upload files with drag & drop, progress bar, and preview support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicForm<IFileUploadForm>
            fields={fields}
            record={record}
            // onSubmit={onSubmit}
            submitBtnLabel="Upload Files" formTitle={''}          />
        </CardContent>
      </Card>

      {/* Features Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">✨ Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Badge>✓</Badge>
              <p className="text-sm">Drag and drop support</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge>✓</Badge>
              <p className="text-sm">Upload progress bar</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge>✓</Badge>
              <p className="text-sm">Image, PDF, Video preview</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge>✓</Badge>
              <p className="text-sm">File size validation</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge>✓</Badge>
              <p className="text-sm">File type validation</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge>✓</Badge>
              <p className="text-sm">Success state</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📝 How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Click "Select File" button or drag & drop a file</li>
            <li>Preview will appear if the format is supported</li>
            <li>Progress bar shows upload status</li>
            <li>Remove the file using the X button</li>
            <li>Submit the form when ready</li>
          </ol>
        </CardContent>
      </Card>

      {/* Submitted Data */}
      {submitted && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg text-green-900">✅ Submitted Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {submitted.profileImage && (
                <div className="p-3 bg-white rounded-lg border border-green-200">
                  <p className="font-semibold text-sm mb-2">Profile Picture:</p>
                  <p className="text-sm text-gray-600">
                    <strong>Name:</strong> {submitted.profileImage.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Size:</strong> {(submitted.profileImage.size / 1024).toFixed(2)} KB
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Type:</strong> {submitted.profileImage.type}
                  </p>
                  {submitted.profileImage.uploadedUrl && (
                    <p className="text-sm text-gray-600">
                      <strong>URL:</strong> <span className="text-blue-600">{submitted.profileImage.uploadedUrl}</span>
                    </p>
                  )}
                </div>
              )}

              {submitted.document && (
                <div className="p-3 bg-white rounded-lg border border-green-200">
                  <p className="font-semibold text-sm mb-2">Document:</p>
                  <p className="text-sm text-gray-600">
                    <strong>Name:</strong> {submitted.document.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Size:</strong> {(submitted.document.size / 1024).toFixed(2)} KB
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Type:</strong> {submitted.document.type}
                  </p>
                </div>
              )}

              {submitted.attachment && (
                <div className="p-3 bg-white rounded-lg border border-green-200">
                  <p className="font-semibold text-sm mb-2">Attachment:</p>
                  <p className="text-sm text-gray-600">
                    <strong>Name:</strong> {submitted.attachment.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Size:</strong> {(submitted.attachment.size / 1024).toFixed(2)} KB
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Type:</strong> {submitted.attachment.type}
                  </p>
                </div>
              )}

              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-sm hover:text-blue-600">
                  View JSON
                </summary>
                <pre className="mt-2 p-3 bg-white rounded-lg border border-green-200 text-xs overflow-auto">
                  {JSON.stringify(submitted, null, 2)}
                </pre>
              </details>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      <Alert>
        <AlertDescription className="text-sm">
          <strong>💡 Tip:</strong> The FILE_UPLOAD input supports drag & drop, progress tracking, and 
          preview for images, PDFs, and more. Configure the fileConfig prop to customize behavior and limits.
        </AlertDescription>
      </Alert>
    </div>
  )
}
