import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brown-700 text-white hover:bg-brown-800",
        secondary: "border-transparent bg-brown-100 text-brown-900 hover:bg-brown-200",
        destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
        outline: "text-brown-900 border-brown-300",
        success: "border-transparent bg-green-600 text-white hover:bg-green-700",
        warning: "border-transparent bg-yellow-600 text-white hover:bg-yellow-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
