'use client';

import { useState, useRef, JSX, useEffect, ReactNode } from 'react';

import { ArrowBigUp, ArrowBigUpDash, Delete, DeleteIcon } from "lucide-react";
import { KeyFontSize, letter } from './key';
import { IKey, KeyboardBuilder } from './keyboard-builder';
import { useKeyboardStore } from './providers/keyboard.store';
import { BaseKeyboard } from './keyboard-base';
import { fontSizeClasses } from '../form/theme/theme-config';
import { FieldProps, TextInputType } from '../form/inputs/base/definitions';
import { cn } from '@/src/lib/utils';

type ShiftMode = "off" | "once" | "caps";
type KeyboardMode = "letters" | "symbols";

type Props = {
  onKeyPress?: (key: string) => void;
  onDelete?: () => void;
  onEnter?: () => void;
  keyFontSize?: KeyFontSize;
  input?: FieldProps
  children?: ReactNode | JSX.Element
  className?:string
};

// export class DateRangeInput extends BaseInput {
//   render(): JSX.Element {
//     const { input, form, isSubmitting } = this;
//     return <FieldDateRangeInput input={input} form={form} isSubmitting={isSubmitting} />;
//   }
// }

export class QwertyKeyboard extends BaseKeyboard {
  render(): JSX.Element {
    const { input, children, className, keyFontSize } = this;
    // console.log("🚀 ~ QwertyKeyboard ~ render ~ children:", children)
    return (
      <KeyboardQwerty children={children} input={input} className={className} keyFontSize={keyFontSize} />
    );
  }
}


// export const KeyboardQwerty = () => {
//   return (
//     <div>KeyboardQwerty</div>
//   )
// }


export const KeyboardQwerty= ({ onKeyPress, onEnter, keyFontSize = 'text-2xl', onDelete, input, children, className  }: Props) => {
  const [shiftMode, setShiftMode] = useState<ShiftMode>('off');
  const [mode, setMode] = useState<KeyboardMode>('letters');
  const lastShiftPress = useRef<number>(0);
  const { currentInputField, write, setIsOpen, backspace, isInputRequired } = useKeyboardStore();
  const storeonEnter = useKeyboardStore((state) => state.onEnter);
  const isUpper = shiftMode !== 'off';
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 🚫 evitar interferencias si no hay input activo
      if (isInputRequired && !currentInputField) return;

      const key = e.key;

      // 🔥 ENTER
      if (key === 'Enter') {
        e.preventDefault();
        onEnter?.();
        storeonEnter?.()
        return;
      }

      // 🔥 BACKSPACE
      if (key === 'Backspace') {
        backspace(); // o maneja delete en tu store
        e.preventDefault();
        onDelete?.();
        return;
      }

      // 🔥 SPACE
      if (key === ' ') {
        e.preventDefault();
        handleKey(' ');
        return;
      }

      // 🔥 SHIFT (solo cambia modo visual, no escribe)
      if (key === 'Shift') {
        handleShift();
        return;
      }
      
      if (key === 'CapsLock') {
        handleCaps();
        return;
      }

      // 🔥 TAB (opcional)
      if (key === 'Tab') {
        e.preventDefault();
        return;
      }

      // 🔥 ESC (cerrar teclado)
      if (key === 'Escape') {
        setIsOpen(false);
        return;
      }

      // 🔥 letras, números y símbolos válidos
      if (key.length === 1) {
        handleKey(key);
        const isAllowed = true;
        // const isAllowed =
        // currentInputField.input.keyFilter?.(key) ?? true;

        if (!isAllowed) {
          e.preventDefault();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentInputField, shiftMode]);
  // useEffect(() => {
  //   keyDownEvents()
  // }, []);


  // 🔥 SHIFT
  const handleShift = () => {
    const now = Date.now();

    if (now - lastShiftPress.current < 300) {
      setShiftMode((prev) => (prev === 'caps' ? 'off' : 'caps'));
    } else {
      setShiftMode((prev) => (prev === 'once' ? 'off' : 'once'));
    }

    lastShiftPress.current = now;
  };

  const handleKey = (key: string) => {
    const output = isUpper ? key.toUpperCase() : key;

    onKeyPress?.(output);
    write(output);

    if (shiftMode === 'once') setShiftMode('off');
  
  };

  const handleCaps = () => {
    setShiftMode((prev) => (prev === 'caps' ? 'off' : 'caps'));
  };

  const shiftLabel = shiftMode === 'caps' ? ArrowBigUpDash : ArrowBigUp;
  const shiftActive = shiftMode !== 'off';
  
  const textField = <>
    {children && (children)}
    {
      !children && currentInputField && (
        <div className="p-3 h-full min-h-16 flex-1 flex flex-row text-2xl font-bold justify-center text-center items-center gap-2 rounded-xl border-2 transition-all  outline-none border-amber-400 bg-amber-50 ">
          <span> 
            {
              (currentInputField.input && currentInputField.input.keyboardType == TextInputType.PASSWORD )
              ? '•'.repeat(currentInputField.field?.value.toString().length)
              : currentInputField.field?.value || ""
            }
          </span>
        </div>
      )
    }
  </>

  const btnDelete = { label: 'delete', icons: [DeleteIcon],  onClick: () => {backspace()}, className: 'bg-red-200 text-xs', style: {backgroundColor:'#faba005e'} }
  const btnEsc = { label: 'esc', onClick: () => {setIsOpen(false)}, className: '', style: {backgroundColor: '#ffc0c05e'} }
  const btnEnter = { label: 'Enter', onClick: onEnter, className: 'flex-[2] bg-green-200', style: {backgroundColor: '#008f003d'} }

  // 🔥 =========================
  // 🔥 MODO SÍMBOLOS
  // 🔥 =========================
  if (mode === 'symbols') {
    const keys: IKey[][] = [
      ['esc','!','@','#','$','%','^','&','*','(',')',],
      ['~','`','|','\\','/','{','}','[',']'],
      ['+','=','<','>','?',"'",'"',':',';'],
    ].map((row,index) =>
      row.map((k,idx): IKey => {
          const isEsc = k == 'esc'
          if(index == 0 && idx == row.length-1) return btnDelete
          if (isEsc)return btnEsc
          return ({ 
            label: k,
            onClick: () => isEsc ? setIsOpen(false) : handleKey(k), 
            className: isEsc ? 'bg-red-600':'',
          } as IKey)
        }
      )
    );




    return (
      <div className={cn('w-full h-full flex flex-col', className)}>
        {textField}
        <KeyboardBuilder className='w-full h-full' keyFontSize={keyFontSize}
          keys={[
            ...keys,
            [
              { label: 'ABC', onClick: () => setMode('letters'), className: 'flex-[2]' },
              { label: ' ', onClick: () => handleKey(' '), className: 'flex-[4]' },
              btnEnter,
            ],
          ]}
        />
      </div>
    );
  }

  // 🔥 =========================
  // 🔥 MODO LETRAS
  // 🔥 =========================

  const fila1 = ['1','2','3','4','5','6','7','8','9','0']
    .map((l) => letter(l, isUpper, handleKey));

  const fila2 = ['q','w','e','r','t','y','u','i','o','p']
    .map((l) => letter(l, isUpper, handleKey));

  const fila3 = ['a','s','d','f','g','h','j','k','l']
    .map((l) => letter(l, isUpper, handleKey));

  const fila4 = ['z','x','c','v','b','n','m']
    .map((l) => letter(l, isUpper, handleKey));



  return (
    <div className='w-full h-full flex flex-col'>
      {textField}
      <KeyboardBuilder className='w-full h-full flex-3' keyFontSize={keyFontSize}
        keys={[
          [
            btnEsc,
            ...fila1,
            btnDelete
          ],
          [
            { label: 'tab', onClick: () => {} },
            ...fila2,
            // { icons:[Delete], onClick: backspace, className: 'text-xs' },
          ],
          [
            { label: 'caps', onClick: handleCaps },
            ...fila3,
          ],
          [
            {
              label: '',
              icons: [shiftLabel],
              onClick: handleShift,
              className: 'flex-1',
              isActive: shiftActive
            },
            ...fila4,
            { label: '.', onClick: () => handleKey('.') },
            { label: '-', onClick: () => handleKey('-') },
            { label: '_', onClick: () => handleKey('_') },
          ],
          [
            { label: '?123', onClick: () => setMode('symbols'), className: 'flex-[2]' },
            { label: ' ', onClick: () => handleKey(' '), className: 'flex-[4]' },
            btnEnter,
          ],
        ]}
      />
    </div>
  );
};