export interface IncidentReport {
  id: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  mediaUrl?: string;
  timestamp: number;
  isAnonymous: boolean;
  severity?: {
    score: number;
    description: string;
  };
  authenticity?: {
    isAuthentic: boolean;
    confidenceScore: number;
    explanation: string;
  };
}
