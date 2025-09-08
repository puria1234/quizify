'use server';
/**
 * @fileOverview Flow for generating multiple-choice questions based on a study guide or topic.
 *
 * - generateMultipleChoiceQuestions - A function that generates multiple-choice questions.
 * - GenerateMultipleChoiceQuestionsInput - The input type for the generateMultipleChoiceQuestions function.
 * - GenerateMultipleChoiceQuestionsOutput - The return type for the generateMultipleChoiceQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMultipleChoiceQuestionsInputSchema = z.object({
  topic: z.string().optional().describe('The topic to generate questions for.'),
  studyGuide: z.string().optional().describe('The study guide content to use for question generation.'),
  numberOfQuestions: z.number().default(5).describe('The number of multiple choice questions to generate.'),
});
export type GenerateMultipleChoiceQuestionsInput = z.infer<typeof GenerateMultipleChoiceQuestionsInputSchema>;

const GenerateMultipleChoiceQuestionsOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The multiple choice question.'),
      options: z.array(z.string()).describe('The possible answers to the question.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('An array of multiple choice questions.'),
});
export type GenerateMultipleChoiceQuestionsOutput = z.infer<typeof GenerateMultipleChoiceQuestionsOutputSchema>;

export async function generateMultipleChoiceQuestions(input: GenerateMultipleChoiceQuestionsInput): Promise<GenerateMultipleChoiceQuestionsOutput> {
  return generateMultipleChoiceQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMultipleChoiceQuestionsPrompt',
  input: {schema: GenerateMultipleChoiceQuestionsInputSchema},
  output: {schema: GenerateMultipleChoiceQuestionsOutputSchema},
  prompt: `You are an expert educator designing multiple-choice questions to test student knowledge.

  Generate {{numberOfQuestions}} multiple-choice questions based on the following topic or study guide. Each question should have 4 possible answers, with one correct answer.  The possible answers should be diverse and not obviously wrong. Return the questions in JSON format.

  {{#if topic}}
  Topic: {{{topic}}}
  {{/if}}

  {{#if studyGuide}}
  Study Guide:
  {{{studyGuide}}}
  {{/if}}

  Make sure that the questions are relevant to the study guide. Use the correct technical terminology.
  `,
});

const generateMultipleChoiceQuestionsFlow = ai.defineFlow(
  {
    name: 'generateMultipleChoiceQuestionsFlow',
    inputSchema: GenerateMultipleChoiceQuestionsInputSchema,
    outputSchema: GenerateMultipleChoiceQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
