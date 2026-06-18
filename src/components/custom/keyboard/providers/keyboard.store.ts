import { create } from 'zustand';
import { InputField, KeyboardState } from './keyboard.state';
import { KeyboardTypes } from '../keyboard-types';
import { JSX, ReactNode } from 'react';


export const useKeyboardStore = create<KeyboardState>((set, get) => ({
  isInputRequired: false,
  activeInput: null,
  inputs: {},
  type: KeyboardTypes.QWERTY,
  currentInputField: null,
  children: undefined,
  isOpen:false,
  isOpenDynamic:false,
  value: '',
  onEnter: undefined,
  isPassword: false,
  inputPlaceholder: undefined,
  infoTooltip: undefined,
  inputLabel: undefined,
  classNameTextField: 'items-center justify-center',

  iconsLeft: [],
  iconsRight:  [],

  setChildren(children?: ReactNode | JSX.Element | null) {
    set({ children: children });
  },
  setOnEnter(onEnter?: () => any) {
    set({ onEnter: onEnter });
  },


  setCurrentInputField(inputField: InputField | null) {
    set({ currentInputField: inputField, isInputRequired: inputField ? true : false });
  },


  setIsOpen(open?:boolean) { 
    if (!open) set({ value: ''})
    set({isOpen: open ?? !get().isOpen, children: undefined}) 
    if (!get().isOpen) {
      set({
        children: undefined, 
        value: '',
        currentInputField: null,
        isInputRequired: false,
        onEnter: undefined
      })
    }
  },
  setIsOpenDynamic(open?:boolean) { 
    if (!open) set({ value: ''})
    set({isOpenDynamic: open ?? !get().isOpenDynamic}) 
    if (!get().isOpenDynamic) {
      set({
        children: undefined, 
        value: '',
        currentInputField: null,
        isInputRequired: false,
        onEnter: undefined
      })
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
}));