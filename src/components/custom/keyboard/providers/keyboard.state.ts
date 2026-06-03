import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { FieldProps } from "../../form/inputs/base/definitions";
import { KeyboardTypes } from "../keyboard-types";

type InputId = string;


export type InputField = {
  input:FieldProps;
  field?: ControllerRenderProps<FieldValues, string> | undefined
}

export interface KeyboardState {
  activeInput: InputId | null;
  inputs: Record<InputId, string>;
  isOpen:boolean
  type: KeyboardTypes


  currentInputField?: InputField | null 

  setCurrentInputField: (inputField: InputField | null) => void;
  
  
  // actions
  registerInput: (id: InputId, initialValue?: string) => void;
  unregisterInput: (id: InputId) => void;
  
  focusInput: (id: InputId) => void;
  
  write: (char: string) => void;
  backspace: () => void;
  clear: () => void;
  
  setValue: (id: InputId, value: string) => void;
  
  setIsOpen:(open?: boolean)=> void
}