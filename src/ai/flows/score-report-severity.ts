'use server';

/**
 * @fileOverview This file defines a Genkit flow for scoring the severity of emergency reports based on text input.
 *
 * - scoreReportSeverity - A function that handles the severity scoring process.
 * - ScoreReportSeverityInput - The input type for the scoreReportSeverity function.
 * - ScoreReportSeverityOutput - The return type for the scoreReportSeverity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScoreReportSeverityInputSchema = z.object({
  reportText: z.string().describe('The text content of the emergency report.'),
});
export type ScoreReportSeverityInput = z.infer<typeof ScoreReportSeverityInputSchema>;

const ScoreReportSeverityOutputSchema = z.object({
  severityScore: z
    .number()
    .describe(
      'A numerical score representing the severity of the emergency, ranging from 0 (low) to 10 (high).'
    ),
  severityDescription: z
    .string()
    .describe('A brief description of the severity level based on the score.'),
});
export type ScoreReportSeverityOutput = z.infer<typeof ScoreReportSeverityOutputSchema>;

export async function scoreReportSeverity(input: ScoreReportSeverityInput): Promise<ScoreReportSeverityOutput> {
  return scoreReportSeverityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scoreReportSeverityPrompt',
  input: {schema: ScoreReportSeverityInputSchema},
  output: {schema: ScoreReportSeverityOutputSchema},
  prompt: `You are an AI assistant designed to assess the severity of emergency reports.

  Based on the text content of the report, provide a severity score between 0 and 10, where 0 indicates a low-severity incident and 10 indicates a critical emergency.
  Also, provide a brief description justifying the assigned severity score.

  Report Text: {{{reportText}}}
  \n  Respond with a JSON object with the following fields:
  - severityScore (number): A numerical score representing the severity of the emergency (0-10).
  - severityDescription (string): A brief explanation of why the given severity score was assigned.
  \n  Ensure that the severity score and description accurately reflect the urgency and potential impact of the reported incident.
  `,
});

const scoreReportSeverityFlow = ai.defineFlow(
  {
    name: 'scoreReportSeverityFlow',
    inputSchema: ScoreReportSeverityInputSchema,
    outputSchema: ScoreReportSeverityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
