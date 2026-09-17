import type { Metadata } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/800.css";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/700.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export const metadata:Metadata={title:"SKYGOAT Digital Sales Guide",description:"Digital sales guide dan media library SKYGOAT"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body><Header/>{children}<Footer/></body></html>}
