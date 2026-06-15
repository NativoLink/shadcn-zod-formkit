import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useKeyboardStore } from "../../../keyboard";
import { CircleCheck, CircleX, Eye, EyeOff, Keyboard, Loader2 } from 'lucide-react';
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { Button, FieldProps, InputTypes, isValidField, TextInputType } from "@/src/components";


interface Props {
  form: UseFormReturn;
  input: FieldProps;
  field: ControllerRenderProps<FieldValues, string> | undefined
  isValid?: boolean
  isSubmitting?: boolean,
  isPasswordField?: boolean,
  showPassword?: boolean,
  setShowPassword?: Dispatch<SetStateAction<boolean>>
}


export const FakeInput = ({ input, field, form, isValid, isSubmitting, isPasswordField, showPassword = false, setShowPassword }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const { 
    setCurrentInputField,
    write,
    backspace,
    setIsOpen,
    currentInputField
  } = useKeyboardStore();

  const [isFocused, setIsFocused] = useState(false);

  // const isPasswordField = input.keyboardType === TextInputType.PASSWORD || input.inputType == InputTypes.PASSWORD;
  const autoValidate = input.zodType ? true : false;

  const value = input?.value ?? field?.value ?? "";

  // 🔥 FOCUS MANUAL
  const handleFocus = () => {
    setIsFocused(true);

    setCurrentInputField({
      input,
      field
    });
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // 🔥 KEYBOARD FÍSICO
  useEffect(() => {
    if (!isFocused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      if (e.key === "Backspace") {
        backspace?.();
        return;
      }

      if (e.key === "Enter") {
        return;
      }

      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (e.key.length === 1) {
        write(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFocused]);

  // 🔥 SINCRONIZAR CON RHF
  useEffect(() => {
    if (!field) return;
    
    field.onChange(field.value);
  }, [currentInputField]);



  const iconValidState = <CircleCheck style={{ color: "#00bf3e" }} />;
  const iconInvalidState = <CircleX style={{ color: "#ff8080" }} />;
  const iconLoadingState = <Loader2 className="animate-spin" style={{ color: "#1e90ff" }} />;

  return (
    <div
      ref={ref}
      tabIndex={0} // 🔥 CLAVE para focus
      onFocus={handleFocus}
      onBlur={handleBlur}
      // onChange={handlerChange}
      onClick={() => ref.current?.focus()}
      className={`
        p-1 min-h-8 w-full flex justify-items-center justify-between flex-row
        text-2xl font-bold rounded-xl border-2
        outline-none transition-all
        ${isFocused 
          ? "border-amber-400 bg-amber-50"
          : "border-blue-200 bg-blue-50" 
        }
      `}
    >
      {value.toString().length == 0 && (<span className="flex-1 text-left self-center text-gray-400"> { input.placeHolder ??  input.label } </span>)}
      {value.toString().length > 0 && (<span className="flex-1 text-left self-center ">
        {
          (input && (isPasswordField && !showPassword))
          ? '•'.repeat(value.toString().length)
          : value || ""
        }
      </span>)}

        <div className="flex flex-row gap-2 self-center">          
          {isPasswordField && (
            <Button
              variant="ghost"
              type="button"
              onClick={() => setShowPassword ? setShowPassword(!showPassword) : {} }
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          )}

          <Button
            variant="ghost"
            type="button" 
            className='text-2xl'  
            onClick={(e) => {
              e.stopPropagation();
              handleFocus()
              setCurrentInputField({ input, field }); // 🔥 importante
              setIsOpen(true); // 🔥 abre teclado SOLO aquí
            }}
          >
            <Keyboard size={20} />
          </Button>

          {/* {autoValidate && (
            <div className="self-center" style={{ alignSelf: 'center'}}>
              {isSubmitting
                ? iconLoadingState
                : isValid
                  ? iconValidState
                  : iconInvalidState}
            </div>
          )} */}
        </div>
    </div>
  );
};