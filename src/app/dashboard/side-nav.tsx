"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Settings,
  ClipboardList,
  Building2,
  LogOut,
  User
} from 'lucide-react';
import type { Database } from '@/lib/supabase/database.types';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface SideNavProps {
  user?: Profile | null;
}

const navigation = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
    icon: Building2,
  },
  {
    title: 'Schedule',
    href: '/dashboard/schedule',
    icon: Calendar,
  },
  {
    title: 'Team',
    href: '/dashboard/team',
    icon: Users,
  },
  {
    title: 'Documents',
    href: '/dashboard/documents',
    icon: FileText,
  },
  {
    title: 'Tasks',
    href: '/dashboard/tasks',
    icon: ClipboardList,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
] as const;

export function SideNav({ user }: SideNavProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/api/auth/signout';
    document.body.appendChild(form);
    form.submit();
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-border/10">
        <Link 
          href="/" 
          className={cn(
            "flex items-center p-3 transition-opacity hover:opacity-80",
            "group-data-[state=expanded]:pl-4",
            "group-data-[state=collapsed]:justify-center"
          )}
        >
          <div className="relative w-6 h-6 mr-3 group-data-[state=collapsed]:mr-0">
            <Image
              src="/logos/logo-no-bg.png"
              alt="constructplan logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <h1 className="brand-text text-lg group-data-[state=collapsed]:hidden flex items-center">
            <span className="text-black">construct</span>
            <span className="text-[#FFB800]">plan</span>
          </h1>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-2 py-4">
          {navigation.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={pathname === item.href}
                  className={cn(
                    "w-full",
                    "group-data-[state=expanded]:pl-4",
                    "group-data-[state=collapsed]:justify-center"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="ml-3 group-data-[state=collapsed]:hidden">
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator className="my-4" />

      <div className="mb-4 px-2 group-data-[state=collapsed]:flex group-data-[state=collapsed]:justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full h-auto p-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex items-center gap-3 group-data-[state=collapsed]:justify-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar_url ?? undefined} />
                      <AvatarFallback>{getInitials(user?.full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start group-data-[state=collapsed]:hidden">
                      <span className="text-sm font-medium">
                        {user?.full_name || 'User'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user?.username || 'No username set'}
                      </span>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/dashboard/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>


      <SidebarFooter>
        <div className={cn(
          "p-3 border-t border-border/10",
          "group-data-[state=expanded]:pl-4",
          "group-data-[state=collapsed]:flex group-data-[state=collapsed]:justify-center"
        )}>
          <SidebarTrigger />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}