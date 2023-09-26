import * as React from 'react';
import { useChat } from 'ai/react';

import { IMessage } from '@/spec/chat';

import { cn } from '@/reactui/lib/utils';
import { Conversation } from '@/reactui/components/conversation';
import { ChatPanel } from '@/reactui/components/chat-panel';
import { EmptyScreen } from '@/reactui/components/empty-screen';
import { ChatScrollAnchor } from '@/reactui/components/chat-scroll-anchor';
import { useLocalStorage } from '@/reactui/lib/hooks/use-local-storage';
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/modal';
import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { toast } from 'react-hot-toast';
import { Divider } from '@nextui-org/react';

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview';
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages: IMessage[];
  id: string;
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  );

  const [previewTokenModal, setPreviewTokenModal] = useState(IS_PREVIEW);
  const [previewTokenInput, setPreviewTokenInput] = useState(
    previewToken ?? ''
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const isLoading = true;
  const setInput = (input: string) => {
    return;
  };
  //   const { messages, append, reload, stop, isLoading, input, setInput } =
  //     useChat({
  //       initialMessages,
  //       id,
  //       body: {
  //         id,
  //         previewToken
  //       },
  //       onResponse(response) {
  //         if (response.status === 401) {
  //           toast.error(response.statusText);
  //         }
  //       }
  //     });
  return (
    <>
      {/* <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {initialMessages.length ? (
          <>
            <ConversationList messages={initialMessages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div> */}
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {initialMessages.length ? (
          <>
            <Conversation messages={initialMessages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <Divider />
        )}
      </div>
      <ChatPanel
        id={id}
        messages={initialMessages}
      />

      <Modal isOpen={previewTokenModal} onOpenChange={setPreviewTokenModal}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {' '}
            Enter your OpenAI Key{' '}
          </ModalHeader>
          <ModalBody>
            If you have not obtained your OpenAI API key, you can do so by{' '}
            <a href="https://platform.openai.com/signup/" className="underline">
              signing up
            </a>{' '}
            on the OpenAI website. This is only necessary for preview
            environments so that the open source community can test the app. The
            token will be saved to your browser&apos;s local storage under the
            name <code className="font-mono">ai-token</code>.
          </ModalBody>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <ModalFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput);
                setPreviewTokenModal(false);
              }}
            >
              Save Token
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
