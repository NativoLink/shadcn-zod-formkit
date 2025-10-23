'use client'

import z from "zod";
import { InputTypes, FieldProps, DynamicForm } from 'shadcn-zod-formkit';


interface IPermission {
  id: string
  name: string
  description?: string
  category: string
  createdAt?:string,
  updatedAt?:string,
}

export const FileForm = () => {
  
  const record = {
    username: "John Doe ",
    email: "johndoe@example.com",
    isActive: true,
    favoriteColor: undefined,
    age: 25,
    role: "editor",
  };


  const mockFields: Array<FieldProps |FieldProps[]> = [


  // 🧾 Campo tipo archivo (file)
  [{
    name: "profileImage",
    label: "Imagen de perfil",
    inputType: InputTypes.FILE,
    required: true,
    zodTypeAny: z
      .any()
      .refine(
        (file) => {
          if (!file) return true;
          return (
            file.size <= 10 * 1024 * 1024 &&
            ["image/jpeg", "image/png"].includes(file.type)
          );
        },
        { message: "Solo se permiten imágenes JPG o PNG de menos de 10MB" }
      )
      .optional(),
  },
  ],
];



  return (
    <>
      <div className="w-full  bg-gray-500/20 rounded-lg ">
      </div>
      <div className="w-full  bg-neutral-50/90 rounded-lg p-2">
        <DynamicForm
        fields={mockFields}
        record={record}
        onSubmit={(data: any) => console.log("📤 Resultado final:", data)}
        />
      </div>
      <div className="w-full  bg-gray-500/40 rounded-lg">
        <pre className="mt-4 text-xs text-gray-500">
          {/* <code>{JSON.stringify(mockFields, null, 2)}</code> */}
        </pre>
      </div>
    </>
  );

  
}

