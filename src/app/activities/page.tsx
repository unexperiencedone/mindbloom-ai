// src/app/activities/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Wind, Smile, BookHeart, FileText, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function BreathingExercise() {
  // In a real app, this would be a more interactive component
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind /> 1-Minute Box Breathing
        </CardTitle>
        <CardDescription>A simple exercise to calm your mind and body.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-center">
            <p>1. Inhale for 4 seconds.</p>
            <p>2. Hold for 4 seconds.</p>
            <p>3. Exhale for 4 seconds.</p>
            <p>4. Hold for 4 seconds.</p>
            <p>Repeat this cycle for one minute.</p>
             <Button>Start Guided Exercise</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MoodJournal() {
    const { toast } = useToast();
    const [journalText, setJournalText] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!journalText.trim()) {
            toast({
                variant: 'destructive',
                title: 'Journal is empty',
                description: 'Please write something before saving.',
            });
            return;
        }
        setIsSaving(true);
        // Simulate saving to backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        toast({
            title: 'Journal Entry Saved!',
            description: 'Your thoughts have been recorded.',
        });
        setJournalText(''); // Clear textarea after saving
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookHeart /> Mood Journal
        </CardTitle>
        <CardDescription>
          Take a moment to write down your thoughts and feelings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea 
            placeholder="How are you feeling right now?" 
            rows={6}
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            disabled={isSaving}
        />
        <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Entry'}
        </Button>
      </CardContent>
    </Card>
  );
}

function GratitudeList() {
    // This is a placeholder for another activity
    return (
     <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smile /> Gratitude List
        </CardTitle>
        <CardDescription>
          Focus on the positive by listing things you're grateful for.
        </CardDescription>
      </CardHeader>
      <CardContent>
         <p className="text-muted-foreground">This feature is coming soon!</p>
      </CardContent>
    </Card>
    );
}

function HistorySummary() {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerateSummary = async () => {
        setIsLoading(true);
        setSummary('');
        try {
            const response = await fetch('/api/user/summarize-history');
            const data = await response.json();
            
            if (!response.ok) {
                // Use the error message from the API if available
                throw new Error(data.error || 'Failed to generate summary.');
            }
            
            // Handle the case where there's no history to summarize
            if (data.summary.startsWith("You don't have any chat history yet")) {
                 toast({
                    title: 'No History Found',
                    description: "Start a conversation with Bloom to build your history!",
                });
            } else {
                setSummary(data.summary);
            }

        } catch (error: any) {
            console.error('Error generating summary:', error);
            // Check for the specific "no history" message to avoid showing a generic error
            if (error.message.includes("You don't have any chat history yet")) {
                 toast({
                    title: 'No History Found',
                    description: "Start a conversation with Bloom to build your history!",
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: error.message || 'Could not generate your history summary. Please try again.',
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText /> History Summary
                </CardTitle>
                <CardDescription>
                    Get an AI-powered summary of your conversation history to reflect on your journey.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={handleGenerateSummary} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Analyzing Your History...' : 'Generate My Summary'}
                </Button>

                {isLoading && (
                   <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                   </div>
                )}
                
                {summary && (
                    <div className="p-4 border rounded-lg bg-secondary/30">
                        <h4 className="font-semibold mb-2">Your Reflection:</h4>
                        <p className="text-sm whitespace-pre-wrap">{summary}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function ActivitiesPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 border-b shadow-sm bg-background">
        <Button variant="ghost" size="icon" onClick={() => router.push('/chat')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight font-headline">
          Refreshing Activities
        </h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Tabs defaultValue="breathing">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="breathing">Breathing</TabsTrigger>
              <TabsTrigger value="journal">Journal</TabsTrigger>
              <TabsTrigger value="gratitude">Gratitude</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>
            <TabsContent value="breathing">
              <BreathingExercise />
            </TabsContent>
            <TabsContent value="journal">
              <MoodJournal />
            </TabsContent>
            <TabsContent value="gratitude">
                <GratitudeList />
            </TabsContent>
            <TabsContent value="summary">
                <HistorySummary />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
