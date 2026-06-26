import type { Metadata } from "next"
import { Newsreader, Inter, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
})
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
})

export const metadata: Metadata = {
  title: "Believers Wardrobe — Christian Clothing, Worldwide Makers",
  description:
    "A marketplace of independent Christian clothing brands from around the world.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${inter.variable} ${plexMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
