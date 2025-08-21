import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { IncidentReport } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ShieldCheck, ShieldAlert, BadgeInfo } from 'lucide-react';

interface IncidentDetailsProps {
  incident: IncidentReport;
}

export default function IncidentDetails({ incident }: IncidentDetailsProps) {
  const getSeverityBadge = (score: number) => {
    if (score >= 7) return <Badge variant="destructive">High</Badge>;
    if (score >= 4) return <Badge variant="secondary">Medium</Badge>;
    return <Badge>Low</Badge>;
  };

  const getAuthenticityColor = (score: number) => {
    if (score > 0.75) return 'text-green-500';
    if (score > 0.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="p-2">
        <CardTitle className="text-base">{incident.description}</CardTitle>
        <CardDescription>
          Reported {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
          {incident.isAnonymous && " (Anonymously)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 space-y-3">
        {incident.mediaUrl && (
          incident.mediaUrl.startsWith('data:image') ? (
            <Image
              src={incident.mediaUrl}
              alt="Incident media"
              width={300}
              height={200}
              className="rounded-md object-cover"
              data-ai-hint="emergency disaster"
            />
          ) : incident.mediaUrl.startsWith('data:audio') ? (
            <audio controls src={incident.mediaUrl} className="w-full">
              Your browser does not support the audio element.
            </audio>
          ) : null
        )}
        <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center"><BadgeInfo className="w-4 h-4 mr-1" />Severity</span>
            <div className="flex items-center gap-2">
                {incident.severity && getSeverityBadge(incident.severity.score)}
                <span className="font-bold">{incident.severity?.score}/10</span>
            </div>
        </div>
        {incident.severity && (
            <p className="text-xs text-muted-foreground italic">"{incident.severity.description}"</p>
        )}
        {incident.authenticity && (
          <>
            <Separator />
            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center">
                        {incident.authenticity.isAuthentic ? <ShieldCheck className="w-4 h-4 mr-1 text-green-500"/> : <ShieldAlert className="w-4 h-4 mr-1 text-red-500"/>}
                        Authenticity
                    </span>
                    <span className={`font-bold ${getAuthenticityColor(incident.authenticity.confidenceScore)}`}>
                        {(incident.authenticity.confidenceScore * 100).toFixed(0)}% Confident
                    </span>
                </div>
                <p className="text-xs text-muted-foreground italic">"{incident.authenticity.explanation}"</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
