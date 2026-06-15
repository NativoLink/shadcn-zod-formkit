import { cn } from "@/src/lib/utils";
import {
  CircleCheck,
  CircleQuestionMark,
  Loader2Icon,
  MessageCircleWarning,
  OctagonX,
  Trash2Icon,
  TriangleAlert,
} from "lucide-react";
import { ReactNode, useEffect } from "react";
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

export type DialogVariant =
  | "info"
  | "warning"
  | "error"
  | "success"
  | "delete"
  | "confirm"
  | "loading";

interface Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  trigger?: ReactNode;

  title?: string | ReactNode;
  description?: string | ReactNode;

  cancelText?: string;
  actionText?: string;

  className?: string;

  iconSize?: string;
  submitBtnClass?: string;
  btnHeightClass?: string;

  onAction?: () => void | Promise<void>;

  children?: ReactNode;

  variant?: DialogVariant;

  loading?: boolean;
  autoCloseOnFinish?: boolean;

  listBtnConfig?: BtnConfig[];
  btnGroupDirection?: "flex-start" | "flex-end" | "flex-center";

  showActionBtn?: boolean;
  centerContent?: boolean;
}

export const DynamicDialog = ({
  open,
  onOpenChange,

  trigger,

  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",

  cancelText = "Cerrar",
  actionText = "Procesar",

  className = "bg-red-600 text-white font-bold",

  variant = "info",
  loading = false,
  autoCloseOnFinish = true,

  onAction,
  children,

  listBtnConfig = [],
  btnGroupDirection = "flex-end",

  submitBtnClass = "h-16",
  iconSize = "w-16 h-16",
  btnHeightClass = "h-16 text-xl",

  showActionBtn = true,
  centerContent = false,
}: Props) => {

  const isLoading = variant === "loading" || loading;

  // 🔥 Auto cerrar cuando termina loading
  useEffect(() => {
    if (!isLoading && open && autoCloseOnFinish) {
      onOpenChange?.(false);
    }
  }, [isLoading]);

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
            variant === "delete"
              ? <Trash2Icon className={iconSize} />
              : <OctagonX className={iconSize} />,
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

      case "loading":
        return {
          container: "!bg-gray-100 !text-gray-800 dark:!bg-gray-900 dark:!text-gray-200",
          border: "!border-gray-500/30 dark:!border-gray-300/30",
          media: "bg-gray-500/10 dark:bg-gray-300/10",
          action: "text-gray-200 bg-gray-500 dark:bg-gray-300",
          icon: "text-gray-500 dark:text-gray-300",
          iconNode: <Loader2Icon className={cn(iconSize, "animate-spin")} />,
        };
    }
  };

  const styles = getVariantStyles();

  const handleActionClick = async () => {
    if (!onAction) return;

    const result = onAction();

    if (result instanceof Promise) {
      // opcional: podrías manejar loading interno aquí
      await result;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <AlertDialogTrigger asChild>
          {trigger}
        </AlertDialogTrigger>
      )}

      <AlertDialogContent
        className={cn(
          "w-full h-fit font-mono border-x-8",
          styles.container,
          styles.border
        )}
      >
        <AlertDialogHeader className="flex flex-col justify-center w-full text-center">
          <div className="flex justify-center w-full">
            <AlertDialogMedia
              className={cn(
                styles.media,
                "rounded-full flex items-center justify-center",
                iconSize
              )}
            >
              <div className={styles.icon}>
                {styles.iconNode}
              </div>
            </AlertDialogMedia>
          </div>

          <AlertDialogTitle className="text-2xl text-center w-full">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className={cn("text-xl w-full flex-row", centerContent ? "text-center" : "text-left")}>
            { description }
          </AlertDialogDescription>
        </AlertDialogHeader>

        {children}

        {!isLoading && (
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
                  onClick={handleActionClick}
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
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};