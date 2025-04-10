"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    workbox?: any
  }
}

export function PWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && window.workbox !== undefined) {
      // Registrar o service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registrado com sucesso:", registration)
        })
        .catch((error) => {
          console.log("Falha ao registrar o Service Worker:", error)
        })
    }
  }, [])

  return null
}
