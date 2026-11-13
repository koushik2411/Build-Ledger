import { Ubuntu } from "next/font/google";
import "./globals.css";

const myFont = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "700"]
});

export const metadata = {
  title: "Build Ledger",
  description: "A digital ledger to track my home expenses",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${myFont.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        {children}
        
      </body>
    </html>
  );
}
