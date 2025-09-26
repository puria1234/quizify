'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
          <CardDescription>
            Your AI-powered study partner. Generate practice quizzes in seconds.
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
                <img
                  className="mr-2 -ml-1 w-4 h-4"
                  aria-hidden="true"
                  focusable="false"
                  alt="Google logo"
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                />
                Sign in with Google
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
