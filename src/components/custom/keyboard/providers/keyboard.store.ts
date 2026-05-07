import { create } from 'zustand';
import { KeyboardState } from './keyboard.state';


export const useKeyboardStore = create<KeyboardState>((set, get) => ({
  activeInput: null,
  inputs: {},

  isOpen:false,

  setIsOpen() { 
    set({isOpen: !get().isOpen}) 
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

  write: (char) =>
    set((state) => {
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
      if (!state.activeInput) return state;

      const current = state.inputs[state.activeInput] || '';

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