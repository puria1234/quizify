'use server';
/**
 * @fileOverview Flow for generating true/false questions based on a study guide or topic.
 *
 * - generateTrueFalseQuestions - A function that generates true/false questions.
 * - GenerateTrueFalseQuestionsInput - The input type for the generateTrueFalseQuestions function.
 * - GenerateTrueFalseQuestionsOutput - The return type for the generateTrueFalseQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTrueFalseQuestionsInputSchema = z.object({
  text: z
    .string()
    .describe('The study guide content or topic to generate questions from.'),
  numQuestions: z.number().describe('The number of true/false questions to generate.'),
});
export type GenerateTrueFalseQuestionsInput = z.infer<
  typeof GenerateTrueFalseQuestionsInputSchema
>;

const GenerateTrueFalseQuestionsOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The true/false question.'),
      isTrue: z.boolean().describe('Whether the statement is true or false.'),
    })
  ),
});
export type GenerateTrueFalseQuestionsOutput = z.infer<
  typeof GenerateTrueFalseQuestionsOutputSchema
>;

export async function generateTrueFalseQuestions(
  input: GenerateTrueFalseQuestionsInput
): Promise<GenerateTrueFalseQuestionsOutput> {
  return generateTrueFalseQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTrueFalseQuestionsPrompt',
  input: {schema: GenerateTrueFalseQuestionsInputSchema},
  output: {schema: GenerateTrueFalseQuestionsOutputSchema},
  prompt: `You are an expert educator creating a true/false quiz.

  Generate true/false questions based on the following text or topic.  The output should be a JSON array of objects.

  Text/Topic: {{{text}}}

  Number of Questions: {{{numQuestions}}}
  `,
});

const generateTrueFalseQuestionsFlow = ai.defineFlow(
  {
    name: 'generateTrueFalseQuestionsFlow',
    inputSchema: GenerateTrueFalseQuestionsInputSchema,
    outputSchema: GenerateTrueFalseQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
