'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Conversation } from '@prisma/client';
import { Loader2, MoreHorizontal, PencilIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useConversations } from '@/hooks/use-conversations';
import { useUser } from '@/hooks/use-user';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '../ui/sidebar';

interface ConversationMenuItemProps {
  id: string;
  title: string;
  active?: boolean;
  onDelete: (id: string) => Promise<void>;
  onRename: (id: string, newTitle: string) => Promise<void>;
}

const ConversationMenuItem = ({
  id,
  title,
  active,
  onDelete,
  onRename,
}: ConversationMenuItemProps) => {
  const router = useRouter();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);

  const handleRename = async () => {
    if (!newTitle.trim() || newTitle === title) {
      setIsRenaming(false);
      return;
    }

    setIsLoading(true);
    try {
      const loadingToast = toast.loading('Renaming conversation...');
      await onRename(id, newTitle);
      toast.dismiss(loadingToast);
      toast.success('Conversation renamed');
      setIsRenaming(false);
    } catch (error) {
      toast.error('Failed to rename conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Deleting conversation...');

      // Perform deletion
      await onDelete(id);

      // Clear loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Conversation deleted');

      // Navigate and refresh after successful deletion
      router.replace('/home');
      router.refresh();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error('Failed to delete conversation');
    }
  };

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={active}>
          <Link href={`/chat/${id}`}>
            <span>{title}</span>
          </Link>
        </SidebarMenuButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction>
              <MoreHorizontal className="h-4 w-4" />
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem onClick={() => setIsRenaming(true)}>
              <PencilIcon className="h-4 w-4" />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              <TrashIcon className="h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new title"
              disabled={isLoading}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsRenaming(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRename}
                disabled={isLoading || !newTitle.trim() || newTitle === title}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Rename
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const AppSidebarConversations = () => {
  const pathname = usePathname();
  const { isLoading: isUserLoading, user } = useUser();
  const {
    conversations,
    isLoading: isConversationsLoading,
    activeId,
    deleteConversation,
    renameConversation,
    setActiveId,
    refreshConversations,
  } = useConversations(user?.id);

  // Handle active conversation and refresh if needed
  useEffect(() => {
    const chatId = pathname.startsWith('/chat/')
      ? pathname.split('/')[2]
      : null;
    setActiveId(chatId);

    // Only refresh if we have a new conversation that's not in the list
    if (chatId && !conversations?.find((conv) => conv.id === chatId)) {
      refreshConversations();
    }
  }, [pathname, setActiveId, conversations, refreshConversations]);

  if (isUserLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Conversations</SidebarGroupLabel>
        <div className="flex items-center justify-center">
          <Loader2 className="mt-4 h-4 w-4 animate-spin" />
        </div>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Conversations</SidebarGroupLabel>
      <SidebarGroupContent className="group-data-[collapsible=icon]:hidden">
        {isConversationsLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mt-4 h-4 w-4 animate-spin" />
          </div>
        ) : !conversations?.length ? (
          <p className="ml-2 text-xs text-muted-foreground">No conversations</p>
        ) : (
          <SidebarMenu>
            {conversations.map((conversation: Conversation) => (
              <ConversationMenuItem
                key={conversation.id}
                id={conversation.id}
                title={conversation.title}
                active={conversation.id === activeId}
                onDelete={deleteConversation}
                onRename={renameConversation}
              />
            ))}
          </SidebarMenu>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
