import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import Providers from "@/lib/Providers";
import { Loader2 } from "lucide-react";
import "./globals.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Budget Tracker | Spandan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="dark"
        style={{
          colorScheme: "dark",
        }}
        suppressHydrationWarning
      >
        <body className={poppins.className}>
          <Providers>
            <ClerkLoading>
              <div className="h-screen w-full flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
                Authenticating...
              </div>
            </ClerkLoading>
            <ClerkLoaded>{children}</ClerkLoaded>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
