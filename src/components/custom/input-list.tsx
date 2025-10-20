import { useState } from "react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Plus } from 'lucide-react';
import { InputSetup, InputTypes } from "./form/inputs/base";

interface Props {
  handleAddInput: (type: InputTypes, config?: InputSetup) => void;
  inputsTypes: InputTypes[];
}



export const InputList = ({ handleAddInput, inputsTypes,  }: Props) => {
  // Estado: un objeto donde la clave es el inputType y el valor su configuración
  const [inputSetups, setInputSetups] = useState<Record<string, InputSetup>>(() =>
    Object.fromEntries(
      inputsTypes.map((type) => [type, { required: false, disabled: false }])
    )
  );

  const toggleConfig = (type: string, key: keyof InputSetup) => {
    setInputSetups((prev) => ({
      ...prev,
      [type]: { ...prev[type], [key]: !prev[type][key] },
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-1">
      {inputsTypes.map((type) => {
        const setup = inputSetups[type];
        return (
          <div
            key={type}
            className="border rounded-lg p-2 flex flex-col-2 gap-1 shadow-sm"
          >
            <Button size="icon" onClick={() => handleAddInput(type, setup)} >
              <Plus/>
            </Button>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex flex-row justify-center w-full  content-center">
                    <span className="font-semibold text-xl">{type}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                 {/* ✅ Controles para configurar */}
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-2">
                      <Switch
                        checked={setup.required}
                        onCheckedChange={() => toggleConfig(type, "required")}
                      />
                      <span>Required</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <Switch
                        checked={setup.disabled}
                        onCheckedChange={() => toggleConfig(type, "disabled")}
                      />
                      <span>Disabled</span>
                    </label>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* <div className="flex justify-between items-center">
              
              <Button
                size="sm"
                onClick={() => handleAddInput(type, setup)}
              >
                Agregar
              </Button>
            </div> */}

            
          </div>
        );
      })}
    </div>
  );
};
