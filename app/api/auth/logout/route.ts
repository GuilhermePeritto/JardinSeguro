import { type NextRequest, NextResponse } from "next/server"
import { logoutAction } from "@/app/actions/auth-actions"

export async function POST(request: NextRequest) {
  await logoutAction()
  return NextResponse.redirect(new URL("/login", request.url))
}
