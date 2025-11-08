import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const notoSansMono = Noto_Sans_Mono({
  variable: "--font-noto-sans-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Short URL",
  description: "URL Shortener",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${notoSans.variable} ${notoSansMono.variable} antialiased tracking-wide`}
      >
        {children}
      </body>
    </html>
  );
}
