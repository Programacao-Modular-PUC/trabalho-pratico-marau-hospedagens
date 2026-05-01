import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import Sidebar from "@/components/Sidebar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Maraú Hospedagens",
  description: "Sistema de Gestão de Hospedagens",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" className={poppins.variable}>
        <body className={`flex min-h-screen bg-gray-50 ${poppins.className}`}>
        <Sidebar />
        <main className="flex-1">{children}</main>
        </body>
        </html>
    );
}
