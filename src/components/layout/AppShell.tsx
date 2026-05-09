'use client';

import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';
import { NotificationProvider } from '@/components/providers/NotificationProvider';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <NotificationProvider>
      <div className="flex flex-col md:flex-row h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-auto pb-28 md:pb-0">
            {children}
          </main>
          <BottomNav />
        </div>
      </div>
    </NotificationProvider>
  );
}
