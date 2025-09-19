// src/app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormField, FormItem, FormMessage, FormControl } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Flower2, MessageSquareHeart } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

function AuthForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (data.email === 'user@example.com' && data.password === 'password123') {
      toast({
        title: 'Login Successful!',
        description: "Welcome back! We're redirecting you to your chat.",
      });
      router.push('/chat');
    } else {
       toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: "Invalid email or password. Please try again.",
      });
    }

    setIsLoading(false);
  };

  const onSignup = async (data: SignupForm) => {
    setIsLoading(true);
    // In a real app, you would call your auth API here.
    // We'll simulate a successful signup for the prototype.
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Signup data:', data);
    toast({
      title: 'Signup Successful!',
      description: "Welcome to MindBloom! We're redirecting you.",
    });
    router.push('/chat');
    setIsLoading(false);
  };

  return (
    <Tabs defaultValue="login" className="w-full max-w-sm">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 space-y-4">
            <h3 className="font-semibold tracking-tight text-center text-lg">
              Welcome Back
            </h3>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Email</Label>
                      <FormControl>
                        <Input placeholder="user@example.com" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Password</Label>
                      <FormControl>
                        <Input type="password" placeholder="password123" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="signup">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 space-y-4">
            <h3 className="font-semibold tracking-tight text-center text-lg">
              Join MindBloom
            </h3>
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Name</Label>
                       <FormControl>
                        <Input placeholder="What should we call you?" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Email</Label>
                       <FormControl>
                        <Input placeholder="you@example.com" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Password</Label>
                      <FormControl>
                        <Input type="password" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}


export default function LandingPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-background overflow-hidden p-4">
        
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-0"></div>

        {/* Background animations */}
        <motion.div
            className="absolute top-10 left-10 text-secondary"
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
            <MessageSquareHeart size={60} strokeWidth={1} />
        </motion.div>
        <motion.div
            className="absolute bottom-20 right-20 text-primary/50"
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        >
            <Flower2 size={100} strokeWidth={0.5} />
        </motion.div>
        <motion.div
            className="absolute bottom-1/2 right-1/4 text-accent"
            animate={{ scale: [1, 0.9, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        >
            <MessageSquareHeart size={40} strokeWidth={1.5} />
        </motion.div>
        
        <main className="z-10 flex flex-col items-center justify-center w-full">
            <motion.div
                initial={{ opacity: 0, y: -100, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="text-center"
            >
                <div className="flex justify-center items-center gap-4 mb-4">
                    <Flower2 className="h-12 w-12 text-primary" />
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-headline">
                        MindBloom AI
                    </h1>
                </div>
                <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-8">
                    Your safe space for reflection and growth. An empathetic AI companion, here to listen without judgment.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                className="w-full"
            >
                <AuthForm />
            </motion.div>
        </main>
    </div>
  );
}
