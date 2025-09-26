'use client';
import {
  BrainCircuit,
  LogOut,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import type { User } from 'firebase/auth';
import AdminPanel from './admin-panel';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type HeaderProps = {
  user: User | null;
  isAdmin: boolean;
  authorizedUsers: string[];
  onUsersUpdate: () => void;
};

export default function Header({
  user,
  isAdmin,
  authorizedUsers,
  onUsersUpdate,
}: HeaderProps) {
  const { toast } = useToast();
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };
  return (
    <header className="w-full max-w-4xl mb-8">
      <div className="relative flex flex-col items-center">
        <div className="flex justify-center items-center">
          <div className="inline-flex items-center gap-3">
            <BrainCircuit className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-extrabold tracking-tighter md:text-5xl">
              Quizify
            </h1>
          </div>
        </div>
        <p className="text-lg text-muted-foreground mt-2 text-center">
          Your AI-powered study partner. Generate practice quizzes in seconds.
        </p>
        <div className="absolute top-0 right-0 flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:inline">{user.displayName}</span>
            </div>
          )}
          {isAdmin && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Shield className="h-4 w-4" />
                  <span className="sr-only">Admin Panel</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Admin Panel</SheetTitle>
                  <SheetDescription>
                    Manage users who can access the application.
                  </SheetDescription>
                </SheetHeader>
                <AdminPanel
                  authorizedUsers={authorizedUsers}
                  onUsersUpdate={onUsersUpdate}
                />
              </SheetContent>
            </Sheet>
          )}
          <Button onClick={handleSignOut} variant="ghost">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
