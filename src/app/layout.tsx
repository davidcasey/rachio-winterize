import type { Metadata } from 'next';

import { WakeLockProvider } from 'app/providers/WakeLockProvider';
import ReactQueryProvider from 'app/providers/ReactQueryProvider';
import MaterialUIProvider from 'app/providers/MaterialUIProvider';

export const metadata: Metadata = {
  title: "Rachio Winterize",
  description: "Winterize your Rachio irrigation system with ease.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <MaterialUIProvider>
          <WakeLockProvider />
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </MaterialUIProvider>
      </body>
    </html>
  );
}
