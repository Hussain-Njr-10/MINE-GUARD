import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'critical' | 'info' | 'outline'
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-mine-border text-mine-text",
    success: "bg-semantic-green/20 text-semantic-green border border-semantic-green/30",
    warning: "bg-semantic-amber/20 text-semantic-amber border border-semantic-amber/30",
    critical: "bg-semantic-red/20 text-semantic-red border border-semantic-red/30",
    info: "bg-semantic-cyan/20 text-semantic-cyan border border-semantic-cyan/30",
    outline: "text-mine-text border border-mine-border",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
