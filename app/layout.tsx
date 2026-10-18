import type { Metadata } from "next";
import { Pixelify_Sans, Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify",
  display: "swap",
});

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-atkinson",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EXPEDIENTE — Jogo Narrativo",
  description:
    "Uma semana decisiva na Raiz Alimentos. Atividade gamificada sobre as 8 inteligências de Gardner com ênfase em interpessoal e intrapessoal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${pixelifySans.variable} ${atkinsonHyperlegible.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#14121F] text-[#F2EFE6] font-body antialiased">
        {children}
      </body>
    </html>
  );
}
