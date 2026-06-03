'use client';

import { useState, useRef, JSX, useEffect } from 'react';

import { ArrowBigUp, ArrowBigUpDash, Delete } from "lucide-react";
import { keyFontSize, letter } from './key';
import { KeyboardBuilder } from './keyboard-builder';
import { useKeyboardStore } from './providers/keyboard.store';
import { BaseKeyboard } from './keyboard-base';

type ShiftMode = "off" | "once" | "caps";
type KeyboardMode = "letters" | "symbols";

type Props = {
  onKeyPress?: (key: string) => void;
  onDelete?: () => void;
  onEnter?: () => void;
  keyFontSize?: keyFontSize;
};



export class QwertyKeyboard extends BaseKeyboard {
  render(): JSX.Element {
    return (
      <KeyboardQwerty />
    );
  }
}


// export const KeyboardQwerty = () => {
//   return (
//     <div>KeyboardQwerty</div>
//   )
// }


export const KeyboardQwerty= ({ onKeyPress, onEnter, keyFontSize = 'text-2xl', onDelete  }: Props) => {
  const [shiftMode, setShiftMode] = useState<ShiftMode>('off');
  const [mode, setMode] = useState<KeyboardMode>('letters');
  const lastShiftPress = useRef<number>(0);
  const { currentInputField, write, setIsOpen, backspace } = useKeyboardStore();
  const isUpper = shiftMode !== 'off';

  useEffect(() => {
    // if (currentInputField) currentInputField.field?.onChange()
    const handleKeyDown = (e: KeyboardEvent) => {
      // 🚫 evitar interferencias si no hay input activo
      if (!currentInputField) return;

      const key = e.key;

      // 🔥 ENTER
      if (key === 'Enter') {
        e.preventDefault();
        onEnter?.();
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentInputField, shiftMode]);

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
    {
      currentInputField && (
        <div className="p-3 h-full min-h-16 flex-1 flex flex-row text-2xl font-bold justify-center text-center items-center gap-2 rounded-xl border-2 transition-all  outline-none border-amber-400 bg-amber-50 ">
          <span> {currentInputField.field?.value} </span>
        </div>
      )
    }
  </>

  // 🔥 =========================
  // 🔥 MODO SÍMBOLOS
  // 🔥 =========================
  if (mode === 'symbols') {
    const keys = [
      ['!','@','#','$','%','^','&','*','(',')'],
      ['~','`','|','\\','/','{','}','[',']'],
      ['+','=','<','>','?',"'",'"',':',';'],
    ].map((row) =>
      row.map((k) => ({
        label: k,
        onClick: () => handleKey(k),
      }))
    );




    return (
      <div className='w-full h-full flex flex-col'>
        {textField}
        <KeyboardBuilder className='w-full h-full' keyFontSize={keyFontSize}
          keys={[
            ...keys,
            [
              { label: 'ABC', onClick: () => setMode('letters'), className: 'flex-[2]' },
              { label: ' ', onClick: () => handleKey(' '), className: 'flex-[4]' },
              { label: 'Enter', onClick: onEnter, className: 'flex-[2] bg-green-200 ' },
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
            { label: 'esc', onClick: () => {setIsOpen(false)}, className: 'bg-red-200' },
            ...fila1,
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
            { label: 'Enter', onClick: onEnter, className: 'flex-[2] bg-green-200' },
          ],
        ]}
      />
    </div>
  );
};