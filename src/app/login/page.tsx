"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  
  // Handle error and success messages from redirects
  useEffect(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
    
    if (message) {
      toast({
        title: "Success",
        description: message,
      });
    }
  }, [searchParams, toast]);

  const handleAuth = async (
    event: React.FormEvent<HTMLFormElement>,
    type: 'login' | 'signup'
  ) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      // Admin bypass (for development only)
      if (email === 'admin' && password === 'admin') {
        router.push('/dashboard');
        return;
      }

      // Submit to the appropriate API route
      const response = await fetch(`/api/auth/${type === 'login' ? 'sign-in' : 'sign-up'}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Authentication failed');
      }

      // Handle successful response
      if (type === 'login') {
        router.push('/dashboard');
      } else {
        toast({
          title: "Success",
          description: "Please check your email to confirm your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] animate-fade-in">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/logos/logo-no-bg.png"
              alt="constructplan logo"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="brand-text text-3xl mb-2">
            <span className="text-black">construct</span>
            <span className="text-[#FFB800]">plan</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            AI-Powered Construction Planning
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <form onSubmit={(e) => handleAuth(e, 'login')}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">Email</Label>
                    <Input
                      id="email-login"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login">Password</Label>
                    <Input
                      id="password-login"
                      name="password"
                      type="password"
                      required
                      disabled={isLoading}
                      autoComplete="current-password"
                      minLength={6}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-[#FFB800] hover:bg-[#E5A600]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Log in"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create account</CardTitle>
                <CardDescription>
                  Enter your details to create your account
                </CardDescription>
              </CardHeader>
              <form onSubmit={(e) => handleAuth(e, 'signup')}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input
                      id="email-signup"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input
                      id="password-signup"
                      name="password"
                      type="password"
                      required
                      disabled={isLoading}
                      autoComplete="new-password"
                      minLength={6}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-[#FFB800] hover:bg-[#E5A600]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign up"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}