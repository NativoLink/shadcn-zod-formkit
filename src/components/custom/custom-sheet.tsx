
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui";
import { useKeyboardStore } from "./keyboard/providers/keyboard.store";


interface Props {
  title?: string | React.ReactNode;
  children?: React.ReactNode;
  childrenHeader?: React.ReactNode;
  isOpen?: boolean;
  side?: 'left' | 'right' | 'top' | 'bottom';
  className?: string
  // toggleSheet: () => void;
}

export const CustomSheet = ({ title = '', children, childrenHeader, isOpen, className, side = 'bottom' }: Props) => {
  // Permite control externo o por store
  const setIsOpen = useKeyboardStore((state) => state.setIsOpen);
  const storeIsOpen = useKeyboardStore((state) => state.isOpen);
  const controlledIsOpen = typeof isOpen === 'boolean' ? isOpen : storeIsOpen;

  return (
    <Sheet open={controlledIsOpen} onOpenChange={setIsOpen} >
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>
            {title}
          </SheetTitle>
          <SheetDescription>
            {childrenHeader}
            {children}
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
