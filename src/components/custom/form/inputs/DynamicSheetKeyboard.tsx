
'use client'
import { CustomSheet, FieldProps, InputField, KeyboardFactory, KeyboardTypes } from "@/src/components"
import { JSX, ReactNode, useEffect, useState } from "react"


interface Props {
  currentInputField?: InputField | null | undefined
  children?: ReactNode| JSX.Element| null
  input?: FieldProps
}

export const DynamicSheetKeyboard = ({currentInputField, children, input}: Props) => {
  
  const content = <> {KeyboardFactory.create( currentInputField?.input.keyboard ?? KeyboardTypes.QWERTY, input, children)} </>
  
  const [container,setContainer] = useState< ReactNode| JSX.Element>(content)

  
  useEffect(()=>{
    setContainer(<> {KeyboardFactory.create( currentInputField?.input.keyboard ?? KeyboardTypes.QWERTY, input, children)} </>)
  },[children])


  
  return <CustomSheet children={ container } />
  
}
