import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import "./globals.css"
import "@/components/landing/landing.css"

import { anton, inter } from "@/components/island/fonts"
import { IslandFooter } from "@/components/island/island-footer"
import { IslandHeader } from "@/components/island/island-header"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { APP_URL } from "@/lib/app-url"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Bolsa de Trabajo",
    template: "%s · Bolsa de Trabajo",
  },
  description: "Encuentra vacantes y postúlate con tu CV en minutos.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${anton.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
      // next-themes sets the theme class on <html> before hydration.
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider>
          {/* Island design system root: frames on black, pill nav and footer (landing.css). */}
          <div className="lp flex min-h-screen flex-col">
            <IslandHeader />
            <main className="flex-1">{children}</main>
            <IslandFooter />
          </div>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
