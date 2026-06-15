
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui";
import { useKeyboardStore } from "./keyboard/providers/keyboard.store";


interface Props {
  title?: string | React.ReactNode;
  children?: React.ReactNode;
  childrenHeader?: React.ReactNode;
  isOpen?: boolean;
  isDynamic?: boolean;
  side?: 'left' | 'right' | 'top' | 'bottom';
  className?: string
  // toggleSheet: () => void;
}

export const CustomSheet = ({ title = '', children, childrenHeader, isOpen, className, side = 'bottom', isDynamic}: Props) => {
  // Permite control externo o por store
  const setIsOpen = useKeyboardStore((state) => state.setIsOpen);
  const setIsOpenDynamic = useKeyboardStore((state) => state.setIsOpenDynamic);
  const storeIsOpen = useKeyboardStore((state) => state.isOpen);
  const storeIsOpenDynamic = useKeyboardStore((state) => state.isOpenDynamic);
  const controlledIsOpen = typeof isOpen === 'boolean' ? isOpen :  storeIsOpen;


  const open = isDynamic ? storeIsOpenDynamic : controlledIsOpen

  return (
    <Sheet open={open} onOpenChange={isDynamic ? setIsOpenDynamic : setIsOpen} >
      <SheetContent side={side} className={className}>
        <SheetHeader>
          <SheetTitle>
            {title}
          </SheetTitle>
          <SheetDescription>
            {childrenHeader}
            {children}
          </SheetDescription>
        </SheetHeader>
        {/* <SheetFooter>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  )
}
