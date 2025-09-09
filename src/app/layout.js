import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Inter } from "next/font/google";
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Hospital Management System | Complete Healthcare Platform",
  description: "Comprehensive hospital management solution for patients, doctors, nurses, and administrators. Manage appointments,  medical records, staff, and more.",
  keywords: 'hospital management, healthcare, medical records, appointments, patient care'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={ inter.className }
      >
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
