import { Button } from "@/components/ui/button"
import type { User } from "@/lib/auth"
import { Lock, LogOut } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  user: User
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between py-4 px-4">
        <div className="flex items-center gap-2">
          <Lock className="h-6 w-6" />
          <Link href="/" className="text-xl font-bold">
            Jardim Seguro
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">Olá, {user.name}</div>

          <form action="/api/auth/logout" method="post">
            <Button variant="ghost" size="icon" type="submit">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Sair</span>
            </Button>
          </form>
        </nav>
      </div>
    </header>
  )
}
