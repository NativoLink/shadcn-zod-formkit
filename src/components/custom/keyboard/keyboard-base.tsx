import { JSX, ReactNode } from 'react';
import { FieldProps } from '../form/inputs/base/definitions';
import { KeyFontSize } from './key';


export abstract class BaseKeyboard {
  constructor(
    protected readonly input?: FieldProps,
    protected readonly children?: ReactNode | JSX.Element,
    protected readonly className?: string,

    // protected readonly form: UseFormReturn,
    protected readonly keyFontSize?: KeyFontSize,
  ) {}

  // abstract render(input?: FieldProps): ReactNode | JSX.Element;
  abstract render(): ReactNode | JSX.Element;
}