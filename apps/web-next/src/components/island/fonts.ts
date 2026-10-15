import { Anton, Inter } from "next/font/google"

/** Island type: Anton for display (titles, wordmarks), Inter for everything else. */
export const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" })
export const inter = Inter({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
})
