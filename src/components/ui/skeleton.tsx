import { cn } from "@/lib/utils"

// Плейсхолдер на время загрузки. По умолчанию — для светлых блоков (кремовых, розовых, белых);
// на бордовом фоне (футер, герой) передавайте tone="dark".
function Skeleton({
  className,
  tone = "light",
  ...props
}: React.ComponentProps<"div"> & { tone?: "light" | "dark" }) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md",
        tone === "light" ? "bg-[#833B46]/10" : "bg-white/15",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
