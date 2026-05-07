'use client'

import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui";
import { useKeyboardStore } from "./keyboard/providers/keyboard.store";


interface Props {
  title?: string;
  children?: React.ReactNode;
  childrenHeader?: React.ReactNode;
  isOpen?: boolean;
  side?: 'left' | 'right' | 'top' | 'bottom';
  // toggleSheet: () => void;
}

export const CustomSheet = ({ title = '', children, childrenHeader, isOpen, side = 'bottom' }: Props) => {

  const setIsOpen = useKeyboardStore((state) => state.setIsOpen);
  const _isOpen = useKeyboardStore((state) => state.isOpen);

  return (
    <Sheet open={_isOpen} onOpenChange={setIsOpen}>
      <SheetContent side={side} className="w-full" >
        <SheetHeader>
          <SheetTitle>
            {title}
          </SheetTitle>
          <SheetDescription>
            {childrenHeader}
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          {children}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
