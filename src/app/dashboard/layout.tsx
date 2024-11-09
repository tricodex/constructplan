// src/app/dashboard/layout.tsx
import { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SideNav } from './side-nav';
import { Chat } from '@/components/ui/chat';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { Database } from '@/lib/supabase/database.types';

type ProfileType = Database['public']['Tables']['profiles']['Row'];

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const supabase = createClient();

  // Get cached user data
  const { data: { user } } = await supabase.auth.getUser();
  
  // If no user, AuthProvider will handle redirect
  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: conversations } = await supabase
    .from('conversations')
    .select('messages')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const formattedMessages = (conversations ?? []).flatMap(conv => {
    if (!conv?.messages || !Array.isArray(conv.messages)) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return conv.messages.map((msgData: any) => ({
      id: `${Date.now()}-${Math.random()}`,
      role: msgData?.role || 'user',
      content: msgData?.content || '',
      timestamp: msgData?.timestamp || new Date().toISOString(),
    }));
  });

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="relative flex min-h-screen bg-background">
        <SideNav user={profile as ProfileType} />
        <div className="flex-1 flex flex-col min-h-screen">
          <main className="flex-1 w-full relative">
            <div className="w-full h-full p-6">
              {children}
            </div>
          </main>
        </div>
        <Chat 
          userId={user.id}
          userName={profile?.full_name || user.email}
          initialMessages={formattedMessages}
        />
      </div>
      <Toaster />
    </SidebarProvider>
  );
}

// could use at somepoint
export function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
    </div>
  );
}

export function DashboardError() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-destructive">Error Loading Dashboard</h1>
        <p className="text-muted-foreground mt-2">Please try refreshing the page</p>
      </div>
    </div>
  );
}