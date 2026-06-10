import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { FieldProps } from "../../form/inputs/base/definitions";
import { KeyboardTypes } from "../keyboard-types";
import { JSX, ReactNode } from "react";

type InputId = string;


export type InputField = {
  input:FieldProps;
  field?: ControllerRenderProps<FieldValues, string> | undefined;
  name?: string;
  onChange?: (value: any) => void;
  getValue?: () => any;
}

export interface KeyboardState {
  activeInput: InputId | null;
  inputs: Record<InputId, string>;
  isOpen:boolean
  isOpenDynamic:boolean
  type: KeyboardTypes
  value: any
  children?: ReactNode | JSX.Element | null
  
  
  isInputRequired?:boolean
  currentInputField?: InputField | null 
  
  onEnter?: () => any
  setOnEnter: (onEnter?:() => any) => void
  setCurrentInputField: (inputField: InputField | null) => void;
  setChildren: (children?: ReactNode | JSX.Element | null) => void;
  
  
  // actions
  registerInput: (id: InputId, initialValue?: string) => void;
  unregisterInput: (id: InputId) => void;
  
  focusInput: (id: InputId) => void;
  
  write: (char: string) => void;
  backspace: () => void;
  clear: () => void;
  
  setValue: (id: InputId, value: string) => void;
  
  setIsOpen:(open?: boolean)=> void
  setIsOpenDynamic:(open?: boolean)=> void
}