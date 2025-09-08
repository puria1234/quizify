'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, BookCopy, FileText } from 'lucide-react';

const formSchema = z.object({
  sourceType: z.enum(['topic', 'studyGuide']).default('topic'),
  sourceText: z
    .string({ required_error: 'Please provide content for your quiz.' })
    .min(10, 'Please provide a more detailed topic or study guide (min 10 characters).')
    .max(5000, 'Content is too long (max 5000 characters).'),
  questionType: z.enum(['mcq', 'tf']).default('mcq'),
  numQuestions: z.coerce.number().min(1).max(10).default(5),
});

export type QuizFormValues = z.infer<typeof formSchema>;

type QuizFormProps = {
  onGenerate: (data: QuizFormValues) => void;
  isLoading: boolean;
};

export default function QuizForm({ onGenerate, isLoading }: QuizFormProps) {
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceType: 'topic',
      sourceText: '',
      questionType: 'mcq',
      numQuestions: 5,
    },
  });

  const sourceType = form.watch('sourceType');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Quiz</CardTitle>
        <CardDescription>
          Provide a topic or paste your study guide to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onGenerate)} className="space-y-8">
            <Tabs
              value={sourceType}
              onValueChange={(value) =>
                form.setValue('sourceType', value as 'topic' | 'studyGuide')
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="topic">
                  <BookCopy className="mr-2 h-4 w-4" />
                  By Topic
                </TabsTrigger>
                <TabsTrigger value="studyGuide">
                  <FileText className="mr-2 h-4 w-4" />
                  By Study Guide
                </TabsTrigger>
              </TabsList>
              <FormField
                control={form.control}
                name="sourceText"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <TabsContent value="topic" forceMount className={sourceType !== 'topic' ? 'hidden' : ''}>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., The history of the Roman Empire"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a topic you want to be quizzed on.
                      </FormDescription>
                    </TabsContent>
                    <TabsContent value="studyGuide" forceMount className={sourceType !== 'studyGuide' ? 'hidden' : ''}>
                      <FormLabel>Study Guide Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your notes or study guide content here..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        Paste the content from your study guide.
                      </FormDescription>
                    </TabsContent>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Tabs>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="questionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mcq">Multiple Choice</SelectItem>
                        <SelectItem value="tf">True / False</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the format for your questions.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        disabled={isLoading}
                        {...field}
                      />
    
                    </FormControl>
                    <FormDescription>
                      How many questions to generate (1-10).
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Quiz
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
