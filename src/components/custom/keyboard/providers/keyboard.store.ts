import { create } from 'zustand';
import { InputField, KeyboardState } from './keyboard.state';
import { KeyboardTypes } from '../keyboard-types';
import { JSX, ReactNode } from 'react';


const DEFAULT_STATE = {
  isInputRequired: false,
  activeInput: null as string | null,
  inputs: {} as Record<string, string>,
  type: KeyboardTypes.QWERTY,
  currentInputField: null as InputField | null,
  children: undefined as ReactNode | JSX.Element | null | undefined,
  isOpen: false,
  isOpenDynamic: false,
  isCloseOnEnter: true,
  value: '',
  onEnter: undefined as (() => any) | undefined,
  isPassword: false,
  inputPlaceholder: undefined as string | undefined,
  infoTooltip: undefined as string | undefined,
  inputLabel: undefined as string | undefined,
  classNameTextField: 'items-center justify-center' as string | undefined,
  iconsLeft: [] as any[],
  iconsRight: [] as any[],
};

export const useKeyboardStore = create<KeyboardState>((set, get) => ({
  ...DEFAULT_STATE,

  reset() {
    set(DEFAULT_STATE);
  },

  setChildren(children?: ReactNode | JSX.Element | null) {
    set({ children: children });
  },
  setOnEnter(onEnter?: () => any) {
    set({ onEnter: 
      () => {
        onEnter?.(); 
        if (get().isCloseOnEnter) get().reset();
      }
    });
  },


  setCurrentInputField(inputField: InputField | null) {
    set({ currentInputField: inputField, isInputRequired: inputField ? true : false });
  },


  setIsOpen(open?: boolean) {
    const next = open ?? !get().isOpen;
    if (!next) {
      get().reset();
    } else {
      set({ isOpen: true, children: undefined });
    }
  },
  setIsOpenDynamic(open?: boolean) {
    const next = open ?? !get().isOpenDynamic;
    if (!next) {
      get().reset();
    } else {
      set({ isOpenDynamic: true });
    }
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

      if (!state.isInputRequired){
        const newValue = get().value + char
        set({ value: newValue });
        state.value = newValue

        return state
      }

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
      if (!state.isInputRequired){
        set({ value: state.value.slice(0, -1) });
        state.value = state.value.slice(0, -1)
      }

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
      if (!state.isInputRequired){
        set({ value: '' });
        state.value = ''
      }
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

  setPlaceholder:(placeholder) => {
    set({ inputPlaceholder: placeholder });
  },
  setIsPassword:(isPass) => {
    set({ isPassword: isPass });
  },
  setInfoToolTip:(tooltip) => {
    set({ infoTooltip: tooltip });
  },
  setIconsLeft:(icons) => {
    set({ iconsLeft: icons });
  },
  setIconsRight:(icons) => {
    set({ iconsRight: icons });
  },
  setInputLabel:(label) => {
    set({ inputLabel: label });
  },
  setClassNameTextField:(className) => {
    set({ classNameTextField: className });
  },
  setIsCloseOnEnter:(isClose) => {
    set({ isCloseOnEnter: isClose });
  },
}));