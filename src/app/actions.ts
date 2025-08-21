'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { scoreReportSeverity } from '@/ai/flows/score-report-severity';
import { verifyReportAuthenticity } from '@/ai/flows/verify-report-authenticity';
import { addIncident } from '@/lib/incidents-store';
import type { IncidentReport } from './lib/types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  isAnonymous: z.string().transform(val => val === 'on'),
  media: z.instanceof(File)
    .optional()
    .refine(file => !file || file.size <= MAX_FILE_SIZE, `File size should be less than 5MB.`)
    .refine(file => !file || file.type.startsWith('image/') || file.type.startsWith('audio/'), 'Only image and audio files are accepted.'),
});

export interface FormState {
  message: string;
  errors?: {
    description?: string[];
    location?: string[];
    media?: string[];
    _form?: string[];
  };
  isSuccess: boolean;
  data?: IncidentReport;
}

async function fileToDataUri(file: File) {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:${file.type};base64,${base64}`;
}

export async function submitReport(prevState: FormState, formData: FormData): Promise<FormState> {
  const mediaFile = formData.get('media') as File | null;
  
  const rawFormData = {
    description: formData.get('description'),
    latitude: formData.get('latitude'),
    longitude: formData.get('longitude'),
    isAnonymous: formData.get('isAnonymous'),
    media: mediaFile && mediaFile.size > 0 ? mediaFile : undefined,
  };

  const parsed = formSchema.safeParse(rawFormData);

  if (!parsed.success) {
    return {
      message: 'Invalid form data.',
      errors: parsed.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  const { description, latitude, longitude, isAnonymous, media } = parsed.data;

  try {
    const newIncidentData: Omit<IncidentReport, 'id' | 'timestamp'> = {
      description,
      location: { lat: latitude, lng: longitude },
      isAnonymous,
    };
    
    const mediaDataUri = media ? await fileToDataUri(media) : null;
    if (mediaDataUri) {
        newIncidentData.mediaUrl = mediaDataUri;
    }

    const [severityResult, authenticityResult] = await Promise.all([
      scoreReportSeverity({ reportText: description }),
      mediaDataUri ? verifyReportAuthenticity({ reportText: description, mediaDataUri }) : Promise.resolve(null)
    ]);
    
    if (severityResult) {
      newIncidentData.severity = {
        score: severityResult.severityScore,
        description: severityResult.severityDescription,
      };
    }
    
    if (authenticityResult) {
      newIncidentData.authenticity = {
        isAuthentic: authenticityResult.isAuthentic,
        confidenceScore: authenticityResult.confidenceScore,
        explanation: authenticityResult.explanation,
      };
    }

    const savedIncident = await addIncident(newIncidentData);

    revalidatePath('/');
    return { message: 'Report submitted successfully!', isSuccess: true, data: savedIncident };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { message: 'An error occurred while submitting the report.', errors: { _form: [errorMessage] }, isSuccess: false };
  }
}
