import { resolve } from 'path';
import { readFile } from 'fs/promises';


import { CodeExample } from '@/components/ui/code-example'
import FormBasics from './BasicForm';


const pathFile = resolve('/Users/nativolink/git/react-form-maker-lib/example/app/examples/basics/BasicForm.tsx')
const rawCodeBasicForm: string = await readFile(pathFile, 'utf-8');


export const BasicFormPage = () => {
  console.log('rawCodeBasicForm', rawCodeBasicForm);
  return (
    <>
      <div className="flex flex-col w-full  bg-gray-500/20 rounded-lg p-2 gap-2">
        <CodeExample code={rawCodeBasicForm} language="javascript" />
      </div>

      <FormBasics />
    </>
  )
}

