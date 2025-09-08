'use client';

import type { MultipleChoiceQuestion, Quiz, TrueFalseQuestion } from '@/types/quiz';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check, X, RefreshCw } from 'lucide-react';

type QuizDisplayProps = {
  quiz: Quiz;
  onReset: () => void;
};

export default function QuizDisplay({ quiz, onReset }: QuizDisplayProps) {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    quiz.questions.forEach((q, index) => {
      const userAnswer = userAnswers[index];
      if (!userAnswer) return;

      if (quiz.type === 'mcq') {
        const mcq = q as MultipleChoiceQuestion;
        if (mcq.correctAnswer === userAnswer) {
          correctAnswers++;
        }
      } else {
        const tfq = q as TrueFalseQuestion;
        if (tfq.isTrue.toString() === userAnswer) {
          correctAnswers++;
        }
      }
    });
    setScore(correctAnswers);
    setIsSubmitted(true);
  };

  const getOptionStyling = (
    question: MultipleChoiceQuestion | TrueFalseQuestion,
    option: string,
    questionIndex: number
  ) => {
    if (!isSubmitted) return '';
    const isMcq = 'correctAnswer' in question;
    const isCorrect = isMcq
      ? (question as MultipleChoiceQuestion).correctAnswer === option
      : (question as TrueFalseQuestion).isTrue.toString() === option;
    const userAnswer = userAnswers[questionIndex];

    if (isCorrect) {
      return 'bg-green-500/10 border-green-500/50 text-green-300';
    }
    if (userAnswer === option && !isCorrect) {
      return 'bg-red-500/10 border-red-500/50 text-red-400';
    }
    return '';
  };
  
  const renderFeedbackIcon = (
    question: MultipleChoiceQuestion | TrueFalseQuestion,
    option: string,
    questionIndex: number
  ) => {
    if (!isSubmitted) return null;
     const isMcq = 'correctAnswer' in question;
    const isCorrect = isMcq
      ? (question as MultipleChoiceQuestion).correctAnswer === option
      : (question as TrueFalseQuestion).isTrue.toString() === option;

    if (isCorrect) {
        return <Check className="h-5 w-5 text-green-400" />;
    }
    if (userAnswers[questionIndex] === option && !isCorrect) {
        return <X className="h-5 w-5 text-red-400" />;
    }
    return <div className="h-5 w-5" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {isSubmitted && (
        <Card className="bg-secondary">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
              <h2 className="text-2xl font-bold">
                Your Score: {score} / {quiz.questions.length}
              </h2>
              <Button onClick={onReset} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Create New Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {quiz.questions.map((q, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader>
            <CardTitle>
              Question {index + 1}: {q.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={userAnswers[index]}
              onValueChange={(value) => handleAnswerChange(index, value)}
              disabled={isSubmitted}
            >
              {(quiz.type === 'mcq'
                ? (q as MultipleChoiceQuestion).options
                : ['true', 'false']
              ).map((option, optionIndex) => (
                <Label
                  key={optionIndex}
                  htmlFor={`q${index}-o${optionIndex}`}
                  className={`flex items-center justify-between p-4 rounded-md border transition-colors cursor-pointer hover:bg-muted/50 ${getOptionStyling(q, option, index)}`}
                >
                  <span className="capitalize">{option.toString()}</span>
                  <div className="flex items-center gap-4">
                    {renderFeedbackIcon(q, option, index)}
                    <RadioGroupItem
                      value={option}
                      id={`q${index}-o${optionIndex}`}
                    />
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      {!isSubmitted && (
        <div className="flex justify-end mt-8">
          <Button
            onClick={handleSubmit}
            size="lg"
            className="bg-accent hover:bg-accent/90"
            disabled={
              Object.keys(userAnswers).length !== quiz.questions.length
            }
          >
            Check Answers
          </Button>
        </div>
      )}
    </div>
  );
}
