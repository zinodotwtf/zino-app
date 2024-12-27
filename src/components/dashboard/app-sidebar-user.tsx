'use client';

import Link from 'next/link';

import { RiTwitterXFill } from '@remixicon/react';
import { BookOpen, ChevronsUpDown, HelpCircle, Settings } from 'lucide-react';
import { LogOut } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUser } from '@/hooks/use-user';

export const AppSidebarUser = () => {
  const { isLoading, user, logout } = useUser();
  const privyUser = user?.privyUser;

  const isMobile = useIsMobile();

  const label = privyUser?.wallet
    ? privyUser.wallet.address.substring(0, 5)
    : privyUser?.email?.address;
  const subLabel = privyUser?.id?.substring(10);
  const twitter = privyUser?.twitter;
  const twitterUsername = twitter?.username;
  const twitterProfileImage = twitter?.profilePictureUrl;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {isLoading || !privyUser ? (
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="ml-auto size-4" />
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={twitterProfileImage || undefined} />
                  <AvatarFallback className="rounded-lg">
                    {label?.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {twitterUsername ? `@${twitterUsername}` : label}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {subLabel}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              {/* Follow us on X */}
              <DropdownMenuItem
                onClick={() => window.open('https://x.com/neur_sh', '_blank')}
              >
                <RiTwitterXFill className="mr-2 h-4 w-4" />
                Follow us on X
              </DropdownMenuItem>

              {/* FAQ */}
              <Link href="/faq">
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  FAQ
                </DropdownMenuItem>
              </Link>

              {/* Docs */}
              <DropdownMenuItem
                onClick={() => window.open('https://docs.neur.sh', '_blank')}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Docs
              </DropdownMenuItem>

              {/* Account */}
              <Link href="/account">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
