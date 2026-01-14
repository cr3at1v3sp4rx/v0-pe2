import { cn } from "@/lib/utils"

export function LoadingSkeleton({
  className,
  variant = "text",
}: {
  className?: string
  variant?: "text" | "card" | "button" | "avatar"
}) {
  const baseClasses = "animate-pulse bg-muted rounded"
  const variantClasses = {
    text: "h-4 w-full",
    card: "h-24 w-full",
    button: "h-10 w-24",
    avatar: "h-10 w-10 rounded-full",
  }

  return <div className={cn(baseClasses, variantClasses[variant], className)} />
}

export function SkeletonCard() {
  return (
    <div className="border border-border/50 rounded-lg p-6 space-y-4">
      <LoadingSkeleton variant="text" className="h-6 w-1/3" />
      <LoadingSkeleton variant="text" className="h-4 w-full" />
      <LoadingSkeleton variant="text" className="h-4 w-5/6" />
      <LoadingSkeleton variant="button" className="h-10 w-24" />
    </div>
  )
}
