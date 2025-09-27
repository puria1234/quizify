'use client';

import { useState, useEffect } from 'react';
import { BrainCircuit, Loader2 } from 'lucide-react';
import QuizForm from '@/components/quiz-form';
import QuizDisplay from '@/components/quiz-display';
import Login from '@/components/login';
import type { Quiz } from '@/types/quiz';
import type { QuizFormValues } from '@/components/quiz-form';
import { useToast } from '@/hooks/use-toast';
import { generateMultipleChoiceQuestions } from '@/ai/flows/generate-multiple-choice-questions';
import { generateTrueFalseQuestions } from '@/ai/flows/generate-true-false-questions';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import NotAuthorized from '@/components/not-authorized';
import { checkUserAuthorization, getAuthorizedUsers, isAdmin as serverIsAdmin } from '@/lib/user-actions';
import Header from '@/components/header';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [authorizedUsers, setAuthorizedUsers] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user && user.email) {
        try {
          const [authorized, admin] = await Promise.all([
            checkUserAuthorization(user.email),
            serverIsAdmin(user.email)
          ]);
          setIsAuthorized(authorized);
          setIsAdmin(admin);
          if (admin) {
            fetchAuthorizedUsers();
          }
        } catch (error) {
          setIsAuthorized(false);
          setIsAdmin(false);
          console.error("Authorization check failed:", error);
        }
      } else {
        setIsAuthorized(null);
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchAuthorizedUsers = async () => {
    try {
      const users = await getAuthorizedUsers();
      setAuthorizedUsers(users);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not fetch authorized users.',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateQuiz = async (data: QuizFormValues) => {
    setIsLoading(true);
    setQuiz(null);

    try {
      let result;
      if (data.questionType === 'mcq') {
        result = await generateMultipleChoiceQuestions({
          topic: data.sourceType === 'topic' ? data.sourceText : undefined,
          studyGuide:
            data.sourceType === 'studyGuide' ? data.sourceText : undefined,
          numberOfQuestions: data.numQuestions,
        });
      } else {
        result = await generateTrueFalseQuestions({
          text: data.sourceText,
          numQuestions: data.numQuestions,
        });
      }
      
      if (result.questions && result.questions.length > 0) {
        setQuiz({ questions: result.questions, type: data.questionType });
      } else {
        toast({
          title: 'Quiz Generation Failed',
          description:
            'The AI could not generate a quiz from the provided topic or text. Please try again with a more specific prompt.',
          variant: 'destructive',
        });
      }

    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Quiz',
        description:
          'There was an unexpected issue creating your quiz. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuiz(null);
  };
  
  if (authLoading || (isAuthorized === null && user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (!isAuthorized) {
    return <NotAuthorized />;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8 relative">
      <Header user={user} isAdmin={isAdmin} onUsersUpdate={fetchAuthorizedUsers} authorizedUsers={authorizedUsers}/>

      <main className="w-full max-w-3xl">
        {quiz ? (
          <QuizDisplay quiz={quiz} onReset={handleReset} />
        ) : (
          <QuizForm onGenerate={handleGenerateQuiz} isLoading={isLoading} />
        )}
      </main>
      <footer className="w-full max-w-4xl mt-12 text-center text-sm text-muted-foreground">
          <p>
            © 2025{' '}
            <a
              href="http://aaravpuri.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              Aarav Puri
            </a>
          </p>
        </footer>
    </div>
  );
}
