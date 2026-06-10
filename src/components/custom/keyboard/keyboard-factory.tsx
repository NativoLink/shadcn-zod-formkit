'use client'
import { JSX, ReactNode } from "react";
import { BaseKeyboard } from "./keyboard-base";
import { QwertyKeyboard } from "./keyboard-qwerty";
import { KeyboardTypes } from "./keyboard-types";
import { FieldProps, TextInputType } from '../form/inputs/base/definitions';



type KeyboardClassConstructor = new (
  input?: FieldProps,
) => BaseKeyboard;

const keyboardMap: Record<KeyboardTypes, KeyboardClassConstructor> = {
  [KeyboardTypes.QWERTY]: QwertyKeyboard,
  [KeyboardTypes.QWERTY_NOT_CHARS]: QwertyKeyboard,
  [KeyboardTypes.NUMBER]: QwertyKeyboard,
};


export class KeyboardFactory {

  static create<T extends Record<string, any> = Record<string, any>>(
    typeKeyboard : KeyboardTypes,
    input?: FieldProps<T>,
    children?: ReactNode| JSX.Element| null,
  ): ReactNode | JSX.Element {
    const inputKbType = input?.keyboardType
    let keyboardType = (typeKeyboard as KeyboardTypes) ?? KeyboardTypes.QWERTY;
    if (inputKbType){
      if (inputKbType == TextInputType.NUMBER) keyboardType = KeyboardTypes.NUMBER
    }

    const keyboardClass = (keyboardMap[keyboardType] ??
      QwertyKeyboard) as new (
       input?: FieldProps<T>,
       children?:  ReactNode| JSX.Element| null,
      ) => { render: () => JSX.Element };

    const instance = new keyboardClass(input, children);

    // if (!input.wrapInCard) return instance.render();

    return (
      <>
        {instance.render()}
      </>
    );
  }
}