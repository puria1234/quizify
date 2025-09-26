'use client';

import { useState, useEffect } from 'react';
import { BrainCircuit, LogOut, Loader2 } from 'lucide-react';
import QuizForm from '@/components/quiz-form';
import QuizDisplay from '@/components/quiz-display';
import Login from '@/components/login';
import { Button } from '@/components/ui/button';
import type { Quiz } from '@/types/quiz';
import type { QuizFormValues } from '@/components/quiz-form';
import { useToast } from '@/hooks/use-toast';
import { generateMultipleChoiceQuestions } from '@/ai/flows/generate-multiple-choice-questions';
import { generateTrueFalseQuestions } from '@/ai/flows/generate-true-false-questions';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGenerateQuiz = async (data: QuizFormValues) => {
    setIsLoading(true);
    setQuiz(null);

    try {
      if (data.questionType === 'mcq') {
        const result = await generateMultipleChoiceQuestions({
          topic: data.sourceType === 'topic' ? data.sourceText : undefined,
          studyGuide:
            data.sourceType === 'studyGuide' ? data.sourceText : undefined,
          numberOfQuestions: data.numQuestions,
        });
        setQuiz({ questions: result.questions, type: 'mcq' });
      } else {
        const result = await generateTrueFalseQuestions({
          text: data.sourceText,
          numQuestions: data.numQuestions,
        });
        setQuiz({ questions: result.questions, type: 'tf' });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Quiz',
        description:
          'There was an issue creating your quiz. Please check your input or try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuiz(null);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setQuiz(null);
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl mb-8 flex flex-col items-center relative">
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
        <div className="absolute top-0 right-0">
          <Button onClick={handleSignOut} variant="ghost">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="w-full max-w-3xl">
        {quiz ? (
          <QuizDisplay quiz={quiz} onReset={handleReset} />
        ) : (
          <QuizForm onGenerate={handleGenerateQuiz} isLoading={isLoading} />
        )}
      </main>
      <footer className="w-full max-w-4xl mt-12 text-center text-sm text-muted-foreground">
        <p>Powered by AI. Always double-check critical information.</p>
      </footer>
    </div>
  );
}
