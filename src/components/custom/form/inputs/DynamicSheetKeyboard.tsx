
'use client'
import { CustomSheet, FieldProps, InputField, KeyboardFactory, KeyboardTypes, KeyFontSize, useKeyboardStore } from "@/src/components"
import { JSX, ReactNode, useEffect, useState } from "react"
import { TextField } from "./types/TextField"


interface Props {
  currentInputField?: InputField | null | undefined
  children?: ReactNode| JSX.Element| null
  input?: FieldProps
  className?: string;
  childClassName?: string;
  keyFontSize?: KeyFontSize;
  isDynamic?: boolean
}

export const DynamicSheetKeyboard = ({currentInputField, children, input, className, childClassName, keyFontSize = 'text-base', isDynamic = false}: Props) => {
  
  const content = <> {KeyboardFactory.create( currentInputField?.input.keyboard ?? KeyboardTypes.QWERTY, input, children)} </>
  const { setCurrentInputField} = useKeyboardStore();

  const [container,setContainer] = useState< ReactNode| JSX.Element>(content)


  useEffect(()=>{
    if (!currentInputField) setCurrentInputField(null)
    setContainer(<> {KeyboardFactory.create( currentInputField?.input.keyboard ?? KeyboardTypes.QWERTY, input, children, childClassName, keyFontSize)} </>)
  },[children])
  


  
  return <CustomSheet children={ container } className={className} isDynamic={isDynamic}/>
  
}
