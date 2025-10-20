import { ReactNode } from "react"

import { MessageCircleWarning } from "lucide-react"
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface Props {
  title: string
  description: string | ReactNode
  className?: string
  variant?: "info" | "warning" | "error" | "success"
}

export const CustomAlert = ({
  title,
  description,
  className = "",
  variant = "info",
}: Props) => {
  const variantClasses = {
    info: "bg-blue-500/25",
    warning: "bg-yellow-500/25",
    error: "bg-red-500/25",
    success: "bg-green-500/25",
  }
  const variantIcons = {
    info: <MessageCircleWarning size={32} className="text-blue-400" />,
    warning: <MessageCircleWarning size={32} className="text-yellow-400" />,
    error: <MessageCircleWarning size={32} className="text-red-400" />,
    success: <InfoCircledIcon className="w-8 h-8 text-green-400" />,
  }
  // const shineColors = {
  //   info: ["#A07CFE", "#FE8FB5", "#FFBE7B"],
  //   warning: ["#FBBF24", "#F97316", "#EF4444"],
  //   error: ["#F87171", "#F43F5E", "#A21CAF"],
  //   success: ["#4ADE80", "#22C55E", "#16A34A"],
  // }

  return (
    <div>
      <Alert
        className={`mb-4 flex items-start gap-3 ${variantClasses[variant]} ${className}`}
      >

        {/* Icono a la izquierda */}
        <div className="flex-shrink-0">{variantIcons[variant]}</div>

        {/* Texto a la derecha */}
        <div className="flex flex-col">
          <AlertTitle className="font-semibold text-xl">{title}</AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            {description}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  )
}
