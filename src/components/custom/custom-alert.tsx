'use client'

import { ReactNode } from "react";
import { MessageCircleWarning } from "lucide-react";
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { cn } from "@/src/lib/utils";

interface Props {
  title: string;
  description: string | ReactNode;
  className?: string;
  variant?: "info" | "warning" | "error" | "success";
}

export const CustomAlert = ({
  title,
  description,
  className = "",
  variant = "info",
}: Props) => {
  const variantClasses = {
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  const variantIcons = {
    info: <MessageCircleWarning size={32} className="text-blue-500 dark:text-blue-300" />,
    warning: <MessageCircleWarning size={32} className="text-yellow-500 dark:text-yellow-300" />,
    error: <MessageCircleWarning size={32} className="text-red-500 dark:text-red-300" />,
    success: <InfoCircledIcon className="w-8 h-8 text-green-500 dark:text-green-300" />,
  };

  return (
    <Alert
      className={cn(
        "mb-4 flex items-start gap-3 border-l-4 p-4 rounded-lg",
        variantClasses[variant],
        className
      )}
    >
      {/* Icono a la izquierda */}
      <div className="flex flex-col shrink-0">{variantIcons[variant]}</div>

      {/* Texto a la derecha */}
      <div className="flex flex-col">
        <AlertTitle className="font-semibold text-lg">{title}</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground dark:text-gray-300">
          {description}
        </AlertDescription>
      </div>
    </Alert>
  );
};
