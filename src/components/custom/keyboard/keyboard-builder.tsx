'use client';

import { ReactNode, useEffect, useMemo, useCallback } from "react";
import { LucideProps } from "lucide-react";
import { Key, keyFontSize, TeclaBorders } from "./key";
import { cn } from '../../../lib/utils';


export interface IKey {
  label?: string;
  onClick?: (key: string) => void;
  className?: string;
  shortcut?: string;
  iconClassName?: string;
  children?: ReactNode;
  iconSize?: number;
  isActive?: boolean;
  disabled?: boolean;
  icons?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >[];
  keyFontSize?: keyFontSize;
  borders?: TeclaBorders;
}

interface Props {
  keys?: Array<IKey[]>;
  withCard?: boolean;
  className?: string;
  keyFontSize?: keyFontSize;
}

export const KeyboardBuilder = ({
  keys,
  withCard = false,
  className,
  keyFontSize,
}: Props) => {

  // 🔹 Map shortcuts → tecla
  const keyMap = useMemo(() => {
    const map = new Map<string, IKey>();

    keys?.forEach((row) => {
      row.forEach((k) => {
        if (k.shortcut) {
          map.set(k.shortcut.toLowerCase(), k);
        }
      });
    });

    return map;
  }, [keys]);

  // 🔥 FUNCIÓN CENTRAL (unifica todo)
  const triggerKey = useCallback((pressedKey: string) => {
    const key = keyMap.get(pressedKey.toLowerCase());

    if (key && !key.disabled) {
      key.onClick?.(pressedKey);

      // 🔹 Simular evento de teclado (para otros listeners)
      const keyboardEvent = new KeyboardEvent("keydown", {
        key: pressedKey,
        bubbles: true,
      });

      window.dispatchEvent(keyboardEvent);
    }
  }, [keyMap]);

  // 🔹 Listener teclado físico
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const active = document.activeElement;

      if (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        (active && active.getAttribute("contenteditable") === "true")
      ) {
        console.log("🚀 ~ Ignorando tecla porque el foco está en un input:", event.key);
        return;
      }

      triggerKey(event.key);
      event.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    
  }, [triggerKey]);

  const content = (
    <div
      className={cn(
        `flex-1 grid grid-rows-${keys?.length} h-full`,
        className
      )}
    >
      {keys?.map((row, ri) => (
        <div key={ri} className="flex flex-row gap-2 p-1 h-full">
          {row.map((key, indx) => {

            const handleClick = () => {
              triggerKey(key.label ?? '' ) // 🔥 triggerKey ahora maneja todo, incluso si no hay shortcut definido
              key.onClick?.(key.label ?? '');
              if (!key.shortcut) return;
              triggerKey(key.shortcut);
            };

            return (
              <>
              {key.label == '' && !key.icons?.length && <div  className={`${key.className}`} key={indx}></div> }
              { (key.label != '' || key.icons?.length)  && <Key
                key={indx}
                borders={{
                  left: key.disabled ? "grey" : "",
                  bottom: key.disabled ? "grey" : "",
                }}
                label={key.label}
                onClick={handleClick} // 🔥 ahora usa triggerKey
                shortcut={key.shortcut}
                icons={key.icons}
                className={`${key.className} ${
                  key.disabled ? "bg-muted-foreground h-full" : "h-full"
                }`}
                iconClassName={key.iconClassName}
                iconSize={key.iconSize}
                fontSize={keyFontSize}
                isActive={key.isActive}
                disabled={key.disabled}
              >
                {key.children}
              </Key>}
              </>
            );
          })}
        </div>
      ))}
    </div>
  );

  if (!withCard) return content;

  return (
    <div className={cn("w-full h-full m-0.5 p-1", className)}>
      {content}
    </div>
  );
};


export type { Key };