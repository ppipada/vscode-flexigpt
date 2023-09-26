import * as React from 'react';

import { useAtBottom } from '@/reactui/lib/hooks/use-at-bottom';
import { cn } from '@/reactui/lib/utils';

import { Button, ButtonProps } from '@nextui-org/button';

import { IconArrowDown } from '@/reactui/components/ui/icons';

export function ButtonScrollToBottom({ className, ...props }: ButtonProps) {
  const isAtBottom = useAtBottom();

  return (
    <Button
      variant="flat"
      size="md"
      className={cn(
        'absolute right-4 top-1 z-10 transition-opacity duration-300 sm:right-8 md:top-2',
        isAtBottom ? 'opacity-0' : 'opacity-100',
        className
      )}
      onClick={() =>
        window.scrollTo({
          top: document.body.offsetHeight,
          behavior: 'smooth'
        })
      }
      {...props}
    >
      <IconArrowDown />
      <span className="sr-only">Scroll to bottom</span>
    </Button>
  );
}
