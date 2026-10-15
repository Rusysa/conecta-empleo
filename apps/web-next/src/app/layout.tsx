import { Suspense } from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { SiteChrome } from "@/components/layout/site-chrome"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { APP_URL } from "@/lib/app-url"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // next-themes sets the theme class on <html> before hydration.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {/* The pathname is unknown while prerendering dynamic routes, so the shell
              falls back to showing the chrome; "/" resolves to none at build time. */}
          <Suspense fallback={<Navbar />}>
            <SiteChrome>
              <Navbar />
            </SiteChrome>
          </Suspense>
          <main className="flex-1">{children}</main>
          <Suspense fallback={<Footer />}>
            <SiteChrome>
              <Footer />
            </SiteChrome>
          </Suspense>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
