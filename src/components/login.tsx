'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useState } from 'react';

const provider = new GoogleAuthProvider();

export default function Login() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      toast({
        title: 'Authentication Failed',
        description:
          error.code === 'auth/popup-closed-by-user'
            ? 'The sign-in window was closed.'
            : 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-2">
            <BrainCircuit className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-extrabold tracking-tighter">
              Quizify
            </h1>
          </div>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>
            Sign in to create your first AI-powered quiz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGoogleSignIn}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              'Signing in...'
            ) : (
              <>
                <svg
                  className="mr-2 -ml-1 w-4 h-4"
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                >
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                  <path fill="#FF3D00" d="M6.306 14.691c-1.342 2.593-2.106 5.59-2.106 8.809s.764 6.216 2.106 8.809l-5.657 5.657C.283 34.39 0 30.29 0 26s.283-8.39 1.649-11.961l5.657 5.657z"/>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                  <path fill="#1976D2" d="M43.611 20.083L43.59 20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.002.002 6.19 5.238C43.021 35.79 44 31.06 44 26c0-1.341-.138-2.65-.389-3.917z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
