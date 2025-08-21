import { config } from 'dotenv';
config();

import '@/ai/flows/verify-report-authenticity.ts';
import '@/ai/flows/score-report-severity.ts';