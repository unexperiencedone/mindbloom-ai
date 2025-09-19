// src/app/thank-you/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold font-headline mb-2">Thank You</h1>
      <p className="max-w-md text-lg text-muted-foreground mb-6">
        Your confirmation has been received. Thank you for taking the time to check in.
      </p>
      <Link href="/chat" passHref>
        <Button>Return to MindBloom AI</Button>
      </Link>
    </div>
  );
}
