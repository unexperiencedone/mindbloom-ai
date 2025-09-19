
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
import { Flower2, MessageSquareHeart, Eye, EyeOff, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const signupSchema = z
  .object({
    name: z.string().min(1, 'Name is required.'),
    email: z.string().email('Invalid email address.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

function AuthForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (data.email.toLowerCase() === 'demo@mindbloom.ai' && data.password === 'Password123') {
        toast({
          title: 'Login Successful!',
          description: "Welcome back! We're redirecting you to your chat.",
        });
        router.push('/chat');
    } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid email or password.',
        });
    }

    setIsLoading(false);
  };

  const onSignup = async (data: SignupForm) => {
    setIsLoading(true);
    
    // Simulate network delay and show a message for the demo
    await new Promise(resolve => setTimeout(resolve, 500));

    toast({
      title: 'Signup Successful!',
      description: "Welcome to MindBloom! We're redirecting you to the chat.",
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
                      <div className="relative">
                        <FormControl>
                          <Input type={showLoginPassword ? 'text' : 'password'} placeholder="Your password" {...field} disabled={isLoading} />
                        </FormControl>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 h-full px-3 text-muted-foreground"
                            onClick={() => setShowLoginPassword(prev => !prev)}
                        >
                            {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                      </div>
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
                       <div className="relative">
                        <FormControl>
                          <Input type={showSignupPassword ? 'text' : 'password'} {...field} disabled={isLoading} />
                        </FormControl>
                         <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 h-full px-3 text-muted-foreground"
                            onClick={() => setShowSignupPassword(prev => !prev)}
                        >
                            {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                       </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                     <FormItem>
                      <Label>Confirm Password</Label>
                       <div className="relative">
                        <FormControl>
                          <Input type={showConfirmPassword ? 'text' : 'password'} {...field} disabled={isLoading} />
                        </FormControl>
                         <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 h-full px-3 text-muted-foreground"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                       </div>
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
    <div className="relative flex flex-col min-h-screen w-full overflow-hidden p-4">
        
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0"></div>

        {/* Background animations */}
        <motion.div
            className="absolute top-10 left-10 text-secondary"
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
            <MessageSquareHeart size={60} strokeWidth={1} />
        </motion.div>
        <motion.div
            className="absolute bottom-20 right-20 text-primary/30"
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
        
        <main className="z-10 flex flex-1 flex-col items-center justify-center w-full">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="text-center"
                >
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <Flower2 className="h-12 w-12 text-primary" />
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-headline">
                            MindBloom AI
                        </h1>
                    </div>
                    <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-8">
                        Your space for reflection and growth. An empathetic AI companion, here to listen.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                    className="w-full"
                >
                    <AuthForm />
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                    className="w-full mt-6"
                >
                    <Card className="bg-secondary/50 border-dashed">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Info size={20} />
                                Demo Credentials
                            </CardTitle>
                             <CardDescription>
                                Use these credentials to log in and explore the app.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm">
                            <div className="space-y-1">
                                <p><strong>Email:</strong> <code className="bg-primary/10 text-primary font-semibold px-2 py-1 rounded-md">demo@mindbloom.ai</code></p>
                                <p><strong>Password:</strong> <code className="bg-primary/10 text-primary font-semibold px-2 py-1 rounded-md">Password123</code></p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </main>
    </div>
  );
}

    