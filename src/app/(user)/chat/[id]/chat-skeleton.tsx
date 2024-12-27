import { ImageIcon, SendHorizontal } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * Generate a random integer between min and max (inclusive)
 */
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Renders a pair of user and AI messages with random dimensions for loading state
 */
function MessagePair({ isFirst = false }: { isFirst?: boolean }) {
  const userMsgHeight = getRandomInt(20, 40);
  const aiMsgHeight = getRandomInt(60, 200);
  const userMsgWidth = getRandomInt(160, 300);
  const aiMsgWidth = getRandomInt(200, 400);

  return (
    <>
      {/* User Message */}
      <div className="flex w-full flex-row-reverse items-start gap-3">
        <div className="relative flex max-w-[85%] flex-col items-end gap-2">
          <div className="relative flex flex-col gap-2 rounded-2xl bg-primary px-4 py-3 text-sm shadow-sm">
            <div
              className="animate-pulse bg-primary"
              style={{
                width: `${userMsgWidth}px`,
                height: `${userMsgHeight}px`,
              }}
            />
          </div>
        </div>
      </div>

      {/* AI Response */}
      <div
        className={`flex w-full items-start gap-3 ${!isFirst ? 'mt-6' : ''}`}
      >
        <Avatar className="mt-0.5 h-8 w-8 shrink-0 select-none">
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <div className="relative flex max-w-[85%] flex-col gap-2">
          <div className="relative flex flex-col gap-2 rounded-2xl bg-muted/60 px-4 py-3 text-sm shadow-sm">
            <div
              className="animate-pulse bg-muted/60"
              style={{
                width: `${aiMsgWidth}px`,
                height: `${aiMsgHeight}px`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Loading skeleton for the chat interface
 * Displays 1-2 message pairs and an input area with disabled controls
 */
export function ChatSkeleton() {
  // Generate 1-2 conversation pairs randomly
  const pairs = getRandomInt(1, 2);

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <div className="relative flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="mx-auto w-full max-w-3xl">
            <div className="space-y-4 px-4 pb-36 pt-4">
              {Array.from({ length: pairs }).map((_, index) => (
                <MessagePair key={index} isFirst={index === 0} />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 z-10">
        {/* Gradient overlay for smooth transition */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/95 to-background/0" />
        <div className="relative mx-auto w-full max-w-3xl px-4 py-4">
          <div className="space-y-4">
            {/* Message input box */}
            <div className="relative overflow-hidden rounded-2xl bg-muted">
              <div className="min-h-[100px] w-full animate-pulse resize-none border-0 bg-transparent px-4 py-[1.3rem]" />

              {/* Action buttons */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-muted"
                  disabled
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>

                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  disabled
                  className="h-8 w-8 hover:bg-muted"
                >
                  <SendHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Footer text */}
            <div className="text-xs text-muted-foreground">...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
