import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Company } from "@/lib/types"
import { cn } from "@/lib/utils"

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("")
}

/** Company logo as an outlined island tile; the fallback is a lavender sticker with initials. */
export function CompanyLogo({
  company,
  className,
}: {
  company: Pick<Company, "name" | "logoUrl">
  className?: string
}) {
  return (
    <Avatar
      className={cn(
        "@container size-12 overflow-hidden rounded-[28%] border border-border bg-white after:hidden",
        className
      )}
    >
      {company.logoUrl && (
        <AvatarImage src={company.logoUrl} alt="" className="rounded-none object-contain" />
      )}
      {/* Fixed lavender fill with black ink: AA in both themes. Initials scale with the tile. */}
      <AvatarFallback className="rounded-none bg-lavender font-display text-[38cqw] leading-none text-black uppercase">
        {initials(company.name)}
      </AvatarFallback>
    </Avatar>
  )
}
