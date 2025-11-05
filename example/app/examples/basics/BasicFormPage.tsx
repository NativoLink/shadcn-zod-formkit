
import { resolve } from 'path';
import { readFile } from 'fs/promises';


import { CodeExample } from '@/components/ui/code-example'
import FormBasics from './BasicForm';
import { GenericFilter } from 'shadcn-zod-formkit';


const pathFile = resolve('/Users/nativolink/git/react-form-maker-lib/example/app/examples/basics/BasicForm.tsx')
const rawCodeBasicForm: string = await readFile(pathFile, 'utf-8');


export const BasicFormPage = () => {
  console.log('rawCodeBasicForm', rawCodeBasicForm);
  return (
    <>
      <div className="w-1/3  bg-gray-500/20 rounded-lg gap-2">
        <CodeExample code={rawCodeBasicForm} language="javascript" />
      </div>
        <FormBasics />
    </>
  )
}

