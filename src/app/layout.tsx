import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'Debating Education Society in Bangladesh | ডিবেটিং এডুকেশন সোসাইটি',
  description: 'National bilingual web platform for Debating Education Society in Bangladesh (DESB). Parliamentary debate schedules, time-locked Google Meet, automated winner highlights, universal communication center, and standard CV maker.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <LanguageProvider>
          <AuthProvider>
            <ThemeProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </ThemeProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
