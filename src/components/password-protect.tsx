'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, KeyRound } from 'lucide-react';
import { verifyPassword } from '@/app/actions';

type PasswordProtectProps = {
  onSuccess: () => void;
};

export default function PasswordProtect({ onSuccess }: PasswordProtectProps) {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await verifyPassword(password);
      if (result.success) {
        onSuccess();
      } else {
        toast({
          title: 'Incorrect Password',
          description: 'Please try again.',
          variant: 'destructive',
        });
        setPassword('');
      }
    } catch (error) {
      toast({
        title: 'An Error Occurred',
        description: 'Please try again later.',
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
              Quizify Study
            </h1>
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <KeyRound className="w-6 h-6" /> Access Required
          </CardTitle>
          <CardDescription>
            Please enter the password to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Unlock'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
