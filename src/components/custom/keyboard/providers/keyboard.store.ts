import { create } from 'zustand';
import { InputField, KeyboardState } from './keyboard.state';
import { KeyboardTypes } from '../keyboard-types';


export const useKeyboardStore = create<KeyboardState>((set, get) => ({
  activeInput: null,
  inputs: {},
  type: KeyboardTypes.QWERTY,
  currentInputField: null,


  setCurrentInputField(inputField: InputField | null) {
    set({ currentInputField: inputField });
  },

  isOpen:false,

  setIsOpen(open?:boolean) { 
    set({isOpen: open ?? !get().isOpen}) 
  },

  registerInput: (id, initialValue = '') =>
    set((state) => ({
      inputs: {
        ...state.inputs,
        [id]: initialValue,
      },
    })),

  unregisterInput: (id) =>
    set((state) => {
      const newInputs = { ...state.inputs };
      delete newInputs[id];
      return { inputs: newInputs };
    }),

  focusInput: (id) => set({ activeInput: id }),

  // write: (char) =>
  //   set((state) => {
  //     const current = state.currentInputField;
  //     if (!current?.field) return state;

  //     const newValue = (current.field.value ?? "") + char;

  //     current.field.onChange(newValue); // 🔥 RHF update

  //     return {
  //       currentInputField: {
  //         ...current,
  //         field: {
  //           ...current.field,
  //           value: newValue
  //         }
  //       }
  //     };
  // }),

  write: (char) =>
    set((state) => {
      let currentInputField = state.currentInputField;
      if (currentInputField && currentInputField.field) {
        currentInputField.field.value += char;
        const newValue = currentInputField.field.value
        set({ currentInputField: currentInputField });
        currentInputField.field.onChange(newValue);
      }
      
      if (!state.activeInput) return state;
      const current = state.inputs[state.activeInput] || '';
      
      return {
        inputs: {
          ...state.inputs,
          [state.activeInput]: current + char,
        },
      };
    }),

  backspace: () =>
    set((state) => {
      let currentInputField = state.currentInputField;
      if (currentInputField && currentInputField.field) {
        const newValue = currentInputField.field.value.slice(0, -1);
        currentInputField.field.value = newValue;
        set({ currentInputField: currentInputField });
        currentInputField.field.onChange(newValue);
      }
      
      if (!state.activeInput) return state;
      
      const current = state.inputs[state.activeInput] || '';
      console.log('RUN BACKSPACE - current value:', current);
      return {
        inputs: {
          ...state.inputs,
          [state.activeInput]: current.slice(0, -1),
        },
      };
    }),

  clear: () =>
    set((state) => {
      if (!state.activeInput) return state;

      return {
        inputs: {
          ...state.inputs,
          [state.activeInput]: '',
        },
      };
    }),

  setValue: (id, value) =>
    set((state) => ({
      inputs: {
        ...state.inputs,
        [id]: value,
      },
    })),
}));