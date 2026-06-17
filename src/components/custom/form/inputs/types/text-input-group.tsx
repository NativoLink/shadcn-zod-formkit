'use client'

import { ChangeEventHandler, Dispatch, ForwardRefExoticComponent, JSX, RefAttributes, SetStateAction, useEffect, useState } from "react";
import { BaseInput, handleOnChage, isValidField } from "../base/base-input";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/src/components/ui/form";
import { 
  InputGroup, 
  InputGroupAddon, 
  InputGroupInput, 
  InputGroupText 
} from "@/src/components/ui/input-group";
import { FieldProps, inputNumberConfig, TextInputType } from "../base/definitions";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { CircleCheck, CircleX, Info, Loader2, Eye, EyeOff, LucideProps, Keyboard } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";
import { Button } from "@/src/components/ui/button";
import { useKeyboardStore } from "../../../keyboard";
import { FakeInput } from "./fake-input";
import { cn } from "@/src/lib";


export class TextInputGroup extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return <FieldTextGroup input={input} form={form} isSubmitting={isSubmitting}/>;
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean; // estado submit externo opcional
}

export const FieldTextGroup = ({ form, input, isSubmitting }: Props) => {
  const [isValid, setIsValid] = useState<boolean>(isValidField(input, form));

  useEffect(() => {
    setIsValid(isValidField(input, form));
  }, [form.formState]);

  const formField = (
    <FormField
      key={input.name}
      control={form.control}
      name={input.name}
      render={({ field }) => {
        return (
          <FormItem className={`${input.withLateralLabel ? 'flex items-center gap-2 flex-row' : ''} ${input.className}`}>
            <FormLabel className={`${input.withLateralLabel ? 'text-right' : ''}`}><b>{input.label}</b></FormLabel>
            <FormControl className={`shadow-lg ${input.withLateralLabel ? ' text-right' : ''}`} >
              {
                CustomInputGroup({
                  input,
                  isSubmitting,
                  field,
                  form,
                  isValid,
                  autoCapitalize: input.autoCapitalize
                })
              }
            </FormControl>

            {/* Descripción */}
            {input.description && <FormDescription>{input.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
    
  return <>{formField}</>;
};


interface customInputGroup {
  value?: any;
  input: FieldProps<Record<string,any>,Record<string,any>>,
  field?: ControllerRenderProps<FieldValues, string>,
  form: UseFormReturn, 
  isSubmitting?: boolean,
  isValid?: boolean,
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters',
  setShowPassword?: Dispatch<SetStateAction<boolean>>, 
  autoValidate?: boolean, 
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined
}


export const applyInputFilter = (
  value: any,
  filter?: (key: any) => boolean
) => {
  if (!filter) return value;

  return value
    .split('')
    .filter(filter)
    .join('');
};

export const CustomInputGroup = ({
  value,
  input,
  field,
  form,
  isSubmitting,
  onChange,
  isValid,
  autoCapitalize = 'none',
}: customInputGroup) => {
  
  const withKeyboard = input.withKeyboard;
  const groupConfig = input.inputGroupConfig;
  const infoTooltip = input?.infoTooltip;
  const autoValidate = groupConfig?.autoValidIcons ?? input.zodType ? true : false;

  const iconValidState = <CircleCheck style={{ color: "#00bf3e" }} />;
  const iconInvalidState = <CircleX style={{ color: "#ff8080" }} />;
  const iconLoadingState = <Loader2 className="animate-spin" style={{ color: "#1e90ff" }} />;

  const iconsRight = groupConfig?.iconsRight ?? [];
  const iconsLeft = groupConfig?.iconsLeft ?? [];
  const textLeft = groupConfig?.textLeft;
  const textRight = groupConfig?.textRight;

  // Estado local para manejar validez desde el primer render
  // const [isValid, setIsValid] = useState<boolean>(isValidField(input, form));

  // 👁️ Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = input.keyboardType === TextInputType.PASSWORD;
  const isNumberField = input.keyboardType === TextInputType.NUMBER;

  const showInputGroupAddons = iconsRight.length > 0 || textRight || autoValidate || infoTooltip || isPasswordField || withKeyboard


  const setIsOpen = useKeyboardStore((state) => state.setIsOpen);
  const setCurrentInputField = useKeyboardStore((state) => state.setCurrentInputField);

  const applyMask = (value: string, mask?: string | RegExp) => {  
    if (!mask) return value;  
      
    if (typeof mask === 'string') {  
      let result = '';  
      let valueIndex = 0;  
        
      for (let i = 0; i < mask.length && valueIndex < value.length; i++) {  
        if (mask[i] === '#') {  
          result += value[valueIndex++];  
        } else {  
          result += mask[i];  
        }  
      }  
      return result;  
    } else if (mask instanceof RegExp) {  
      const matches = value.match(mask);  
      return matches ? matches.join('') : value;  
    }  
      
    return value;  
  }; 

  const formatNumber = (value: string, config?: inputNumberConfig) => {  
    if (!config || value === "") return value;  
      
    let numValue = parseFloat(value);  
    if (isNaN(numValue)) return value;  
      
    // Aplicar restricciones  
    if (config.min !== undefined && numValue < config.min) return config.min.toString();  
    if (config.max !== undefined && numValue > config.max) return config.max.toString();  
    if (!config.allowDecimals) numValue = Math.floor(numValue);  
      
    // Formatear con separadores  
    const options: Intl.NumberFormatOptions = {  
      minimumFractionDigits: config.allowDecimals ? config.decimalPlaces || 2 : 0,  
      maximumFractionDigits: config.allowDecimals ? config.decimalPlaces || 2 : 0,  
    };  
      
    let formatted = numValue.toLocaleString('en-US', options);  
      
    // Reemplazar separadores si es necesario  
    if (config.thousandsSeparator) {  
      formatted = formatted.replace(/,/g, config.thousandsSeparator);  
    }  
    if (config.decimalSeparator && config.decimalSeparator !== '.') {  
      formatted = formatted.replace('.', config.decimalSeparator);  
    }  
      
    // Agregar prefijo y sufijo  
    return `${config.prefix || ''}${formatted}${config.suffix || ''}`;  
  }; 

  const applyTransform = (value: string, transform?: FieldProps['transform']) => {  
    if (!transform) return value;  
      
    if (typeof transform === 'function') {  
      return transform(value);  
    }  
      
    switch (transform) {  
      case 'uppercase':  
        return value.toUpperCase();  
      case 'lowercase':  
        return value.toLowerCase();  
      case 'capitalize':  
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();  
      case 'trim':  
        return value.trim();  
      default:  
        return value;  
    }  
  }; 


  // if (input.isFakeInput){
  //   // if (field && !field?.onChange) field.onChange = () => { console.log('CAMBIANDO....') }
  //   return (
  //     <FakeInput
  //       input={input}
  //       field={field}
  //       form={form}
  //     />
  //   )
  // }
  
  // useEffect(()=>{
  //   setIsValid(isValidField(input, form));
  // },[input])

  let fieldType = (isPasswordField && !showPassword) ? "password" : isNumberField ? "number" : "text" 
  if (input.isFakeInput) fieldType = 'hidden'
  const inputGroupClass = input.isFakeInput ? fieldType : ''


  useEffect(() => {
    if (!input.isFakeInput) return 
    field?.onChange(value);
    isValidField(input, form);

    handleOnChage(field?.value, input, field);
  },[field?.value])

  return (
    <div>
    { input.isFakeInput && (<FakeInput input={input} field={field} form={form} setShowPassword={setShowPassword} isPasswordField={isPasswordField} showPassword={showPassword}   />) }
    <InputGroup className={cn(input.classNameGroupInput ?? 'h-10', inputGroupClass)}>
      {/* Iconos izquierda */}
      {(iconsLeft.length > 0 || textLeft) && (
        <InputGroupAddon>
          {textLeft && <InputGroupText>{textLeft}</InputGroupText>}
          {iconsLeft.map((IconComponent, index) => (
            <IconComponent key={index} size={20} />
          ))}
        </InputGroupAddon>
      )}


      {/* Input principal */}
      <InputGroupInput
        className={input.classNameInput ?? 'h-full text-xl font-semibold'}
        placeholder={input.placeHolder}
        disabled={input.disabled || isSubmitting}
        onBlur={field?.onBlur}
        onFocus={() => {
          if (withKeyboard) setCurrentInputField({ input, field });
        }}
        name={field?.name}
        ref={field?.ref}
        type={fieldType}
        value={field?.value ?? value ?? ""}
        onChange={(e) => {
          
            // const filtered = applyInputFilter(e.target.value, input.keyFilter);
            // if (onChange) {
            //   onChange(e)
            // }
            let value: any = e.target.value;
            if (isNumberField) {
              const numConfig = input.inputNumberConfig;  
    
              // Limpiar valor para obtener solo números  
              const cleanValue = value.replace(/[^\d.-]/g, '');  
              const numValue = cleanValue === "" ? "" : Number(cleanValue);  
                
              // Formatear si está configurado  
              if (numConfig?.formatOnInput) {  
                value = formatNumber(cleanValue, numConfig);  
              } else {  
                value = numValue;  
              }  
            } else {  
              let processedValue = value;  
              // processedValue = applyMask(processedValue, input.mask);  
              value = applyTransform(processedValue, input.transform);  
            }  
            field?.onChange(value);
            onChange?.({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
            isValidField(input, form);
            handleOnChage(value, input, field);
          }
        } 
        // {...field} 
        />

      {/* Iconos derecha */}
      {showInputGroupAddons && (
        <InputGroupAddon align="inline-end">
          {/* Tooltip de información */}
          {infoTooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={20} />
              </TooltipTrigger>
              <TooltipContent>
                <p>{infoTooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {textRight && <InputGroupText>{textRight}</InputGroupText>}
          {iconsRight.map((IconComponent, index) => (
            <IconComponent key={index} size={20} />
          ))}

          {/* 👁️ Toggle mostrar/ocultar contraseña */}
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword) }
              className="p-1"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}

          {withKeyboard && (
            <button type="button" className='text-2xl'  
              onClick={() => {
                setIsOpen();
                setCurrentInputField({ input, field })
              }} >  
              <Keyboard />
            </button>
          )}

          {/* Icono de validación / loading */}
          {/* {autoValidate && (
            <div>
              {isSubmitting
                ? iconLoadingState
                : isValid
                  ? iconValidState
                  : iconInvalidState}
            </div>
          )} */}
        </InputGroupAddon>
      )}
    </InputGroup>
    </div>
  );
}

