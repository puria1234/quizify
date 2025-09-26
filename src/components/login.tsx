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
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 381.5 512 244 512 110.1 512 0 401.9 0 265.9S110.1 19.8 244 19.8c70.5 0 131.3 32.5 173.8 84.8l-73.4 68.3c-23.4-22.3-56.9-36.5-99.3-36.5-83.5 0-151.8 68.3-151.8 152.2s68.3 152.2 151.8 152.2c97.1 0 134.4-65.1 140.2-99.3H244v-87.9h244z"
                  ></path>
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
