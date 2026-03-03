'use client';

import { JSX } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { BaseInput, FieldProps } from "../base";
import { ComboboxInput } from "./combo-box-input";

// AutocompleteInput is an alias for ComboboxInput with async support
export class AutocompleteInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    // Reuse ComboboxInput for now
    const comboboxInstance = new ComboboxInput(input, form, isSubmitting);
    return comboboxInstance.render();
  }
}
