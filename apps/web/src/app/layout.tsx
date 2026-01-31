import type { Metadata } from 'next';
import { DialogProvider } from '../context/DialogContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIBOM - 50대 이후, 새로운 인연',
  description: '50대 이후, 새로운 인연을 만나보세요',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased font-sans">
        <DialogProvider>{children}</DialogProvider>
      </body>
    </html>
  );
}
