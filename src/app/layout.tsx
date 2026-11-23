import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'Debating Education Society in Bangladesh | ডিবেটিং এডুকেশন সোসাইটি',
  description: 'National bilingual web platform for Debating Education Society in Bangladesh (DESB). Parliamentary debate schedules, time-locked Google Meet, automated winner highlights, universal communication center, and standard CV maker.',
  icons: {
    icon: '/images/logo.png',
    shortcut: '/favicon.ico',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white overflow-x-hidden">
        <LanguageProvider>
          <AuthProvider>
            <ThemeProvider>
              <div className="min-h-screen flex flex-col md:flex-row">
                {/* Fixed/Sticky Left Sidebar on Desktop & Tablet / Clean Drawer on Mobile */}
                <Sidebar />

                {/* Main Content Area on the Right */}
                <div className="flex-1 min-w-0 flex flex-col min-h-screen">
                  <main className="flex-1 min-w-0">
                    {children}
                  </main>
                  <Footer />
                </div>
              </div>
            </ThemeProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
