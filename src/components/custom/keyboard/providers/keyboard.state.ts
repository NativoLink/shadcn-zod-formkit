type InputId = string;

export interface KeyboardState {
  activeInput: InputId | null;
  inputs: Record<InputId, string>;
  isOpen:boolean
  
  
  // actions
  registerInput: (id: InputId, initialValue?: string) => void;
  unregisterInput: (id: InputId) => void;
  
  focusInput: (id: InputId) => void;
  
  write: (char: string) => void;
  backspace: () => void;
  clear: () => void;
  
  setValue: (id: InputId, value: string) => void;
  
  setIsOpen:()=> void
}