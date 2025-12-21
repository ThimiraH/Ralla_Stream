import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ralla - Stream The New Wave",
  description: "Watch Dramas, Movies, TV series, and anime online from Ralla",
  icons: {
    icon: "/Ralla-Logo.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white" suppressHydrationWarning={true}> {/* මුළු සයිට් එකම කළු පාට කලා */}
        <AuthProvider>

          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

          <Navbar /> {/* 2. Navbar එක මෙතනට දැම්මා */}

          {/* මේ children කියන එකෙන් තමයි අපි හදන අනිත් pages පේන්න ගන්නේ */}
          <main>
            {children}
          </main>

          <Footer />

        </AuthProvider>
      </body>
    </html>
  );
}
