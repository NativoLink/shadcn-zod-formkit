import { JSX } from "react";

import { UseFormReturn } from "react-hook-form";
import { FieldProps } from "./definitions";
// import { FieldProps } from "./field-props";


export abstract class BaseInput {
  constructor(
    protected readonly input: FieldProps,
    protected readonly form: UseFormReturn
  ) {}

  abstract render(): JSX.Element;
}