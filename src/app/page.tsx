'use client';

import { useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import QuizForm from '@/components/quiz-form';
import QuizDisplay from '@/components/quiz-display';
import type { Quiz } from '@/types/quiz';
import type { QuizFormValues } from '@/components/quiz-form';
import { useToast } from '@/hooks/use-toast';
import { generateMultipleChoiceQuestions } from '@/ai/flows/generate-multiple-choice-questions';
import { generateTrueFalseQuestions } from '@/ai/flows/generate-true-false-questions';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const { toast } = useToast();

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

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl mb-8 text-center md:mb-12">
        <div className="inline-flex items-center gap-3 mb-2">
          <BrainCircuit className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-extrabold tracking-tighter md:text-5xl">
            Quizify Study
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Your AI-powered study partner. Generate practice quizzes in seconds.
        </p>
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
