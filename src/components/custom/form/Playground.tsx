import { useState } from 'react'
import z from 'zod';
import validationMessages from './input-errors';
import { InputList } from '../input-list';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { FieldProps, InputSetup } from './inputs/base/definitions';
import { inputFieldComp, InputTypes } from './inputs/base/input-types';
import { DynamicFormExample } from './inputs';


export const Playground = () => {

  const title = "TEST-FORM";
  const record = {
    username: "Luis",
    email: null,
    age: 28,
  };
  const mockFields: Array<FieldProps| FieldProps[]> = [
    [ 
      { name: "username", label: "Usuario", inputType: InputTypes.TEXT, ZodTypeAny: z.string().min(2) },
      { name: "email", label: "Correo", inputType: InputTypes.TEXT, ZodTypeAny: z.string().email() },
    ]
  ];

  // ✅ Estado de campos dinámicos
  const [fieldsConfig, setFieldsConfig] = useState<Array<FieldProps| FieldProps[]>>(mockFields);


  // ✅ Agregar input dinámico
  const handleAddInput = (inputType: InputTypes, setup?: InputSetup) => {
    console.log("🚀 ~ handleAddInput ~ setup:", setup)
    const disabled:boolean = setup?.disabled ?? Math.random() < 0.5;
    const required:boolean = setup?.required ?? Math.random() < 0.5;
    const uuid= crypto.randomUUID().slice(0,4)
    const newInput: FieldProps = {
      name: `${inputType}_${uuid}`,
      label: `label_${inputType}_${uuid}`,
      placeHolder: `Escribe (${inputType})`,
      inputType: inputType,
      disabled: disabled,
      required: required,
      description: ``,
      ZodTypeAny: required ? z.string(validationMessages.required).min(required ? 1 : 0, { message: validationMessages.required }): undefined,
    }
    console.log("🚀 ~ handleAddInput ~ newInput:", newInput)
    setFieldsConfig((prev) => {
      return [...prev, newInput];
    });
  };


  // ✅ Submit
  const handleSubmit = async (data: any) => {
    console.log('.............handleSubmit')
    // toast.info(<pre><b>{JSON.stringify(data, null, 2)}</b></pre>);
  };

  return (
    <div className='grid grid-cols-3 w-full gap-4'>

      <div className='flex flex-col  w-full h-full'> 
        <InputList inputsTypes={inputFieldComp} handleAddInput={handleAddInput}/>
      </div>

      <div className='flex flex-col  w-full h-full'>
        <DynamicFormExample />
        {/* <DynamicForm fields={fieldsConfig} record={record} onSubmit={handleSubmit}/> */}
      </div>

      <div className='flex flex-col bg-gray-200 rounded-xl'>
      <ScrollArea className="h-200 w-full rounded-md  p-4">
        <pre className="mt-4 text-xs text-gray-500">
          <code>{JSON.stringify(fieldsConfig, null, 2)}</code>
        </pre>
        </ScrollArea>
      </div>
    </div>
  )
}
