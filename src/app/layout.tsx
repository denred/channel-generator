import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Channel Analyzer",
  description: "AI-powered YouTube channel analyzer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <Toaster position="top-right" />
        <div className="flex min-h-screen justify-center">
          <div className="w-full max-w-4xl px-6 py-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
