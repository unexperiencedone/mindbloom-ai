// src/app/chat/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Flower2, Send, User, Settings, BrainCircuit } from 'lucide-react';
import { CrisisAlert } from '@/components/crisis-alert';
import { chat } from '@/ai/flows/chat';
import { detectCrisisKeywords } from '@/ai/flows/detect-crisis-keywords';

type Message = {
  role: 'user' | 'model';
  content: string;
};

// Simple fetcher to update last active timestamp
const updateUserActivity = async () => {
  try {
    await fetch('/api/user/update-activity', { method: 'POST' });
  } catch (error) {
    console.error('Failed to update user activity:', error);
  }
};


function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div
      className={cn(
        'flex items-end gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-9 w-9 border bg-secondary/50 text-secondary-foreground">
          <AvatarFallback className="bg-transparent">
            <Flower2 className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[75%] rounded-lg p-3 text-sm shadow-sm transition-all duration-300 ease-in-out animate-in fade-in',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-card text-card-foreground rounded-bl-none'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
      {isUser && (
        <Avatar className="h-9 w-9 border">
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 justify-start">
      <Avatar className="h-9 w-9 border bg-secondary/50 text-secondary-foreground">
        <AvatarFallback className="bg-transparent">
          <Flower2 className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-card text-card-foreground rounded-lg rounded-bl-none p-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:-0.3s]"></span>
          <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:-0.15s]"></span>
          <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse"></span>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content:
        "Hello! I'm Bloom. 🌸 How are you feeling today? Feel free to share whatever is on your mind.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Update activity on mount
  useEffect(() => {
    updateUserActivity();
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Update activity on new message
    updateUserActivity();

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const crisisCheck = await detectCrisisKeywords({ text: input });

      if (crisisCheck.isCrisis) {
        setShowCrisisAlert(true);
        setIsLoading(false);
        return;
      }

      const chatHistory = newMessages
        .filter(m => m.role === 'user' || m.role === 'model')
        .map(({ role, content }) => ({ role, content }));

      const aiResponse = await chat({
        history: chatHistory.slice(0, -1),
        prompt: input,
      });

      const modelMessage: Message = {
        role: 'model',
        content: aiResponse.response,
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error('Error during chat:', error);
      const errorMessage: Message = {
        role: 'model',
        content:
          "I'm sorry, something went wrong. I'm having a little trouble connecting right now. Please try again later.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <header className="flex items-center justify-between p-4 border-b shadow-sm bg-background">
           <Link href="/activities" passHref>
            <Button variant="ghost" size="icon" aria-label="Activities">
              <BrainCircuit className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight font-headline text-center">
            MindBloom AI 🌸
          </h1>
          <Link href="/settings" passHref>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <ChatBubble key={index} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </main>

        <footer className="border-t bg-background p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Share what's on your mind..."
                className="flex-1"
                disabled={isLoading}
                aria-label="Chat input"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </footer>
      </div>
      <CrisisAlert open={showCrisisAlert} onOpenChange={setShowCrisisAlert} />
    </>
  );
}
