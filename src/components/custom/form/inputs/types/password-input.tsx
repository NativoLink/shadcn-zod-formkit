'use client';

import { JSX } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { BaseInput, FieldProps } from "../base";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/src/lib/utils";

export class PasswordInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return (
      <FieldPassword form={form} input={input} isSubmitting={isSubmitting} />
    );
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Contains uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Contains number", test: (p) => /\d/.test(p) },
  { label: "Contains special character", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const FieldPassword = ({ input, form, isSubmitting }: Props): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);
  const showStrength = input.showStrength ?? false;
  const showRequirements = input.showRequirements ?? false;

  const calculateStrength = (password: string): number => {
    if (!password) return 0;
    const passed = requirements.filter((req) => req.test(password)).length;
    return (passed / requirements.length) * 100;
  };

  const getStrengthColor = (strength: number): string => {
    if (strength < 40) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = (strength: number): string => {
    if (strength < 40) return "Weak";
    if (strength < 70) return "Medium";
    return "Strong";
  };

  return (
    <FormField
      key={input.name as string}
      control={form.control}
      name={input.name as string}
      render={({ field }) => {
        const strength = calculateStrength(field.value || "");

        return (
          <FormItem className={input.className}>
            <FormLabel><b>{input.label}</b></FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    disabled={input.disabled || isSubmitting}
                    placeholder={input.placeHolder || "Enter password"}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={input.disabled || isSubmitting}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                {showStrength && field.value && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Password strength:</span>
                      <span className={cn(
                        "font-medium",
                        strength < 40 && "text-red-500",
                        strength >= 40 && strength < 70 && "text-yellow-500",
                        strength >= 70 && "text-green-500"
                      )}>
                        {getStrengthLabel(strength)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full transition-all duration-300", getStrengthColor(strength))}
                        style={{ width: `${strength}%` }}
                      />
                    </div>
                  </div>
                )}

                {showRequirements && field.value && (
                  <div className="space-y-1 text-xs">
                    {requirements.map((req, index) => {
                      const passed = req.test(field.value);
                      return (
                        <div
                          key={index}
                          className={cn(
                            "flex items-center gap-2",
                            passed ? "text-green-600" : "text-muted-foreground"
                          )}
                        >
                          {passed ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          <span>{req.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </FormControl>
            {input.description && <FormDescription>{input.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
