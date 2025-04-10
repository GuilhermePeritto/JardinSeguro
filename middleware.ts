import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const user = await getUser()
  const pathname = request.nextUrl.pathname

  // Rotas que não precisam de autenticação
  const publicRoutes = ["/login", "/register"]

  // Verificar se o usuário está autenticado
  if (!user && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirecionar usuários autenticados para a página inicial se tentarem acessar rotas públicas
  if (user && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
