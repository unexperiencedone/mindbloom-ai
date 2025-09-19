// src/app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Trash2, Moon, Sun, Monitor } from 'lucide-react';

const trustedContactSchema = z.object({
  contactName: z.string().min(1, 'Name is required.'),
  contactEmail: z.string().email('Invalid email address.'),
  contactPhone: z.string().optional(),
});

const formSchema = z.object({
  isSafetyNetEnabled: z.boolean(),
  inactivityThresholdHours: z.coerce
    .number()
    .min(1, 'Must be at least 1 hour.')
    .max(168, 'Cannot exceed 168 hours (1 week).'),
  trustedContacts: z.array(trustedContactSchema).max(3, 'You can add up to 3 trusted contacts.'),
});

type UserProfileForm = z.infer<typeof formSchema>;

function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<UserProfileForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isSafetyNetEnabled: false,
      inactivityThresholdHours: 48,
      trustedContacts: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'trustedContacts',
  });

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          // Setting form values from fetched data
          form.reset({
            isSafetyNetEnabled: data.isSafetyNetEnabled || false,
            inactivityThresholdHours: data.inactivityThresholdHours || 48,
            trustedContacts: data.trustedContacts || [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load your settings.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [form, toast]);

  const onSubmit = async (data: UserProfileForm) => {
     setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Your settings have been saved.',
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save your settings.',
      });
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 border-b shadow-sm bg-card">
        <Button variant="ghost" size="icon" onClick={() => router.push('/chat')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight font-headline">
          Settings
        </h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
        <div className="max-w-2xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label>Theme</Label>
                <ThemeSwitcher />
              </div>
            </CardContent>
          </Card>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Proactive Safety Net</CardTitle>
                  <CardDescription>
                    Enable this feature to automatically notify your trusted contacts if you're inactive for a chosen period. Your privacy is our priority.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="isSafetyNetEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Enable Inactivity Notifications
                          </FormLabel>
                          <FormDescription>
                            Your trusted contacts will be notified if you're inactive.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inactivityThresholdHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inactivity Period (in hours)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 48" {...field} disabled={isLoading || !form.watch('isSafetyNetEnabled')}/>
                        </FormControl>
                         <FormDescription>
                            Notify contacts after this many hours of inactivity.
                          </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trusted Contacts</CardTitle>
                  <CardDescription>
                    Add up to 3 people you trust to check in on you. We will only contact them if the safety net is triggered.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                       <FormField
                          control={form.control}
                          name={`trustedContacts.${index}.contactName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Jane Doe" {...field} disabled={isLoading || !form.watch('isSafetyNetEnabled')} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name={`trustedContacts.${index}.contactEmail`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Email</FormLabel>
                              <FormControl>
                                <Input placeholder="jane.doe@example.com" {...field} disabled={isLoading || !form.watch('isSafetyNetEnabled')}/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`trustedContacts.${index}.contactPhone`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Phone (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="+15551234567" {...field} disabled={isLoading || !form.watch('isSafetyNetEnabled')} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7"
                          onClick={() => remove(index)}
                          disabled={isLoading || !form.watch('isSafetyNetEnabled')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  ))}
                   <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ contactName: '', contactEmail: '', contactPhone: '' })}
                    disabled={fields.length >= 3 || isLoading || !form.watch('isSafetyNetEnabled')}
                  >
                    Add Trusted Contact
                  </Button>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Settings'}
                    </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
