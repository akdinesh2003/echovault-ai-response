// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Verifies the authenticity of a user-submitted emergency report by analyzing its media (image/audio) content.
 *
 * - verifyReportAuthenticity - A function that handles the report authenticity verification process.
 * - VerifyReportAuthenticityInput - The input type for the verifyReportAuthenticity function.
 * - VerifyReportAuthenticityOutput - The return type for the verifyReportAuthenticity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyReportAuthenticityInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A media file (image or audio) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  reportText: z.string().describe('The text content of the emergency report.'),
});

export type VerifyReportAuthenticityInput = z.infer<typeof VerifyReportAuthenticityInputSchema>;

const VerifyReportAuthenticityOutputSchema = z.object({
  isAuthentic: z
    .boolean()
    .describe(
      'A boolean value indicating whether the report is likely to be authentic (true) or a potential false report (false).'
    ),
  confidenceScore: z
    .number()
    .describe(
      'A numerical score (between 0 and 1) representing the confidence level of the authenticity verification. Higher values indicate greater confidence in the report authenticity.'
    ),
  explanation: z
    .string()
    .describe('A detailed explanation of the AI analysis and the reasoning behind the authenticity determination.'),
});

export type VerifyReportAuthenticityOutput = z.infer<typeof VerifyReportAuthenticityOutputSchema>;

export async function verifyReportAuthenticity(
  input: VerifyReportAuthenticityInput
): Promise<VerifyReportAuthenticityOutput> {
  return verifyReportAuthenticityFlow(input);
}

const verifyReportAuthenticityPrompt = ai.definePrompt({
  name: 'verifyReportAuthenticityPrompt',
  input: {schema: VerifyReportAuthenticityInputSchema},
  output: {schema: VerifyReportAuthenticityOutputSchema},
  prompt: `You are an AI assistant designed to verify the authenticity of emergency reports.

You will receive an emergency report that includes a media file (image or audio) and accompanying text. Your task is to analyze the provided information and determine the likelihood of the report being genuine.

Consider the following factors during your analysis:

*   Consistency between the media and the text description.
*   Presence of anomalies or inconsistencies in the media.
*   Plausibility of the scenario described in the report.

Based on your analysis, provide the following output in JSON format:

*   isAuthentic: A boolean value indicating whether the report is likely to be authentic (true) or a potential false report (false).
*   confidenceScore: A numerical score (between 0 and 1) representing your confidence level in the authenticity verification. Higher values indicate greater confidence in the report authenticity.
*   explanation: A detailed explanation of your analysis and the reasoning behind your determination.

Here is the emergency report:

Text: {{{reportText}}}
Media: {{media url=mediaDataUri}}

Please provide your analysis in JSON format:

`,
});

const verifyReportAuthenticityFlow = ai.defineFlow(
  {
    name: 'verifyReportAuthenticityFlow',
    inputSchema: VerifyReportAuthenticityInputSchema,
    outputSchema: VerifyReportAuthenticityOutputSchema,
  },
  async input => {
    const {output} = await verifyReportAuthenticityPrompt(input);
    return output!;
  }
);
