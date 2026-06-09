import { JSX, ReactNode } from 'react';
import { FieldProps } from '../form/inputs/base/definitions';
// onKeyPress?: (key: string) => void;
// onDelete?: () => void;
// onEnter?: () => void;
// keyFontSize?: keyFontSize;

export abstract class BaseKeyboard {
  constructor(
    // protected readonly input: FieldProps,
    // protected readonly form: UseFormReturn,
    // protected readonly keyFontSize?: keyFontSize,
  ) {}

  abstract render(input?: FieldProps): ReactNode | JSX.Element;
}