import { Header } from "@/components/header"
import { requireAuth } from "@/lib/auth"
import type React from "react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  return (
    <>
      <Header user={user} />
      <main className="p-6">{children}</main>
    </>
  )
}
