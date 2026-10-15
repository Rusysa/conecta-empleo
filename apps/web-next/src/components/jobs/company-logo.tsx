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

export function CompanyLogo({
  company,
  className,
}: {
  company: Pick<Company, "name" | "logoUrl">
  className?: string
}) {
  return (
    <Avatar className={cn("size-12 rounded-lg", className)}>
      {company.logoUrl && <AvatarImage src={company.logoUrl} alt="" />}
      <AvatarFallback className="rounded-lg bg-primary/10 font-semibold text-primary">
        {initials(company.name)}
      </AvatarFallback>
    </Avatar>
  )
}
