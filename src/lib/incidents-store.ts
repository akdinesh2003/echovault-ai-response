import 'server-only';
import type { IncidentReport } from './types';

const incidents: IncidentReport[] = [
  {
    id: '1',
    description: 'Structure fire reported near downtown crossing. Multiple units responding.',
    location: { lat: 42.3554, lng: -71.0605 },
    timestamp: Date.now() - 1000 * 60 * 5,
    isAnonymous: false,
    severity: {
      score: 8,
      description: 'High severity due to potential for structural collapse and spread to nearby buildings.'
    },
    authenticity: {
        isAuthentic: true,
        confidenceScore: 0.95,
        explanation: 'The report text is clear and specific, mentioning a "structure fire" and that "multiple units" are responding, which are typical characteristics of a genuine emergency report. The location provided corresponds to a dense urban area where such an event would be significant and require a multi-unit response.'
    }
  },
  {
    id: '2',
    description: 'Minor traffic collision on Mass Ave bridge. No injuries reported.',
    location: { lat: 42.3581, lng: -71.0822 },
    timestamp: Date.now() - 1000 * 60 * 12,
    isAnonymous: true,
    severity: {
      score: 3,
      description: 'Low severity, minor traffic disruption expected.'
    },
    mediaUrl: 'https://placehold.co/600x400.png',
  }
];

export async function getIncidents(): Promise<IncidentReport[]> {
  return incidents.sort((a, b) => b.timestamp - a.timestamp);
}

export async function addIncident(incident: Omit<IncidentReport, 'id' | 'timestamp'>): Promise<IncidentReport> {
  const newIncident: IncidentReport = {
    ...incident,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  incidents.unshift(newIncident);
  return newIncident;
}

export async function getIncidentById(id: string): Promise<IncidentReport | undefined> {
    return incidents.find(incident => incident.id === id);
}
