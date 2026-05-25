'use client';

import { useState, useRef, JSX } from 'react';

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


  const { currentInputField, write } = useKeyboardStore();


  const isUpper = shiftMode !== 'off';

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
    console.log('Key pressed:', key);
    const output = isUpper ? key.toUpperCase() : key;

    onKeyPress?.(output);
    write(output);

    if (shiftMode === 'once') {
      setShiftMode('off');
    }
  };

  const handleCaps = () => {
    setShiftMode((prev) => (prev === 'caps' ? 'off' : 'caps'));
  };

  const shiftLabel = shiftMode === 'caps' ? ArrowBigUpDash : ArrowBigUp;
  const shiftActive = shiftMode !== 'off';

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
      <>
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
      </>
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
    <>
      {
        currentInputField && (
          <div className="mb-2 text-xl text-center text-muted-foreground border">
            {`Field: ${currentInputField.field?.value}`}
          </div>
        )
      }
      <KeyboardBuilder className='w-full h-full' keyFontSize={keyFontSize}
        keys={[
          [
            { label: 'esc', onClick: () => {}, className: 'bg-red-200' },
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
    </>
  );
};