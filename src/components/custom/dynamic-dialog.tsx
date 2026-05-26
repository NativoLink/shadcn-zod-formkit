import { cn } from "@/src/lib/utils";
import {
  CircleCheck,
  CircleQuestionMark,
  MessageCircleWarning,
  OctagonX,
  Trash2Icon,
  TriangleAlert,
} from "lucide-react";
import { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { BtnConfig } from "./form/inputs/base/definitions";
import { ButtonGroup } from "../ui/button-group";

interface Props {
  trigger?: ReactNode;
  title?: string;
  description?: string;
  cancelText?: string;
  className?: string;
  actionText?: string;
  iconSize?: string;
  submitBtnClass?: string;
  btnHeightClass?: string;
  onAction?: () => void;
  children?: ReactNode;
  variant?: "info" | "warning" | "error" | "success" | "delete" | "confirm";
  listBtnConfig?: BtnConfig[];
  btnGroupDirection?: "flex-start" | "flex-end" | "flex-center";
  showActionBtn?: boolean;
}

export const DynamicDialog = ({
  trigger,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  cancelText = "Cancel",
  actionText = "Confirmar",
  className = "bg-red-600 text-white font-bold",
  variant = "info",
  onAction,
  children,
  listBtnConfig = [],
  btnGroupDirection = "flex-end",
  submitBtnClass = "h-16",
  iconSize = "w-16 h-16",
  btnHeightClass = "h-16",
  showActionBtn = true,
}: Props) => {
  
  // 🔥 AQUÍ ESTÁ LA CLAVE: CLASES INLINE (NO OBJETOS DINÁMICOS)

  const getVariantStyles = () => {
    switch (variant) {
      case "info":
        return {
          container: "!bg-blue-100 !text-blue-800 dark:!bg-blue-900 dark:!text-blue-200",
          border: "!border-blue-500/30 dark:!border-blue-300/30",
          media: "bg-blue-500/10 dark:bg-blue-300/10",
          action: "text-blue-200 bg-blue-500 dark:bg-blue-300",
          icon: "text-blue-500 dark:text-blue-300",
          iconNode: <MessageCircleWarning className={iconSize} />,
        };

      case "warning":
        return {
          container: "!bg-yellow-100 !text-yellow-800 dark:!bg-yellow-900 dark:!text-yellow-200",
          border: "!border-yellow-500/30 dark:!border-yellow-300/30",
          media: "bg-yellow-500/10 dark:bg-yellow-300/10",
          action: "text-yellow-200 bg-yellow-500 dark:bg-yellow-300",
          icon: "text-yellow-500 dark:text-yellow-300",
          iconNode: <TriangleAlert className={iconSize} />,
        };

      case "error":
      case "delete":
        return {
          container: "!bg-red-100 !text-red-800 dark:!bg-red-900 dark:!text-red-200",
          border: "!border-red-500/30 dark:!border-red-300/30",
          media: "bg-red-500/10 dark:bg-red-300/10",
          action: "text-red-200 bg-red-500 dark:bg-red-300",
          icon: "text-red-500 dark:text-red-300",
          iconNode:
            variant === "delete" ? (
              <Trash2Icon className={iconSize} />
            ) : (
              <OctagonX className={iconSize} />
            ),
        };

      case "success":
        return {
          container: "!bg-green-100 !text-green-800 dark:!bg-green-900 dark:!text-green-200",
          border: "!border-green-500/30 dark:!border-green-300/30",
          media: "bg-green-500/10 dark:bg-green-300/10",
          action: "text-green-200 bg-green-500 dark:bg-green-300",
          icon: "text-green-500 dark:text-green-300",
          iconNode: <CircleCheck className={iconSize} />,
        };

      case "confirm":
        return {
          container: "!bg-purple-100 !text-purple-800 dark:!bg-purple-900 dark:!text-purple-200",
          border: "!border-purple-500/30 dark:!border-purple-300/30",
          media: "bg-purple-500/10 dark:bg-purple-300/10",
          action: "text-purple-200 bg-purple-500 dark:bg-purple-300",
          icon: "text-purple-500 dark:text-purple-300",
          iconNode: <CircleQuestionMark className={iconSize} />,
        };
    }
  };

  const styles = getVariantStyles();

  console.log('onAction',onAction)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || <Button variant="outline">Show Dialog</Button>}
      </AlertDialogTrigger>

      <AlertDialogContent
        className={cn(
          "w-50 h-fit font-mono border-x-8",
          styles.container,
          styles.border
        )}
      >
        <AlertDialogHeader className="justify-center w-full text-center">
          <div className="flex justify-center w-full">
            <AlertDialogMedia
              className={cn(
                styles.media,
                "rounded-full flex items-center justify-center",
                iconSize // 🔥 ahora controla también el contenedor
              )}
            >
              <div className={styles.icon}>
                {styles.iconNode}
              </div>
            </AlertDialogMedia>
          </div>

          <div className="flex justify-center w-full">
            <AlertDialogTitle className="text-2xl">
              {title}
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="text-xl text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {children}

        <AlertDialogFooter>
          <ButtonGroup
            className="flex w-full"
            style={{
              justifyContent: btnGroupDirection,
              alignItems: "center",
            }}
          >
            <AlertDialogCancel className={cn("flex-1", btnHeightClass)}>
              {cancelText}
            </AlertDialogCancel>

            {listBtnConfig.map((btn, key) => (
              <Button
                key={key}
                type={btn.btnType}
                size="lg"
                className={cn(btnHeightClass, submitBtnClass)}
                variant={btn.variant}
                onClick={btn.onClick}
                disabled={btn.disabled}
              >
                {btn.label}
              </Button>
            ))}

            {onAction && showActionBtn && (
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault(); // 🔥 CLAVE: evita comportamiento raro

                  if (onAction) {
                    onAction();
                  }
                }}
                className={cn(
                  "flex-1",
                  btnHeightClass,
                  className,
                  styles.action
                )}
              >
                {actionText}
              </AlertDialogAction>
            )}
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

