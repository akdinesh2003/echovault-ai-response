import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { IncidentReport } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ShieldCheck, ShieldAlert, BadgeInfo, User, UserX } from 'lucide-react';

interface IncidentDetailsProps {
  incident: IncidentReport;
}

export default function IncidentDetails({ incident }: IncidentDetailsProps) {
  const getSeverityBadge = (score: number) => {
    if (score >= 7) return <Badge variant="destructive">High</Badge>;
    if (score >= 4) return <Badge variant="secondary" className="bg-yellow-600 text-black">Medium</Badge>;
    return <Badge className="bg-green-600">Low</Badge>;
  };

  const getAuthenticityColor = (score: number) => {
    if (score > 0.75) return 'text-green-400';
    if (score > 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="p-0">
        <CardTitle className="text-base font-medium">{incident.description}</CardTitle>
        <CardDescription className="flex items-center justify-between text-xs">
          <span>Reported {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}</span>
          <span className='flex items-center gap-1'>
            {incident.isAnonymous ? <UserX className="w-3 h-3" /> : <User className="w-3 h-3" />}
            {incident.isAnonymous ? "Anonymous" : "Verified"}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 mt-3 space-y-3">
        {incident.mediaUrl && (
          incident.mediaUrl.startsWith('data:image') ? (
            <div className="relative aspect-video">
              <Image
                src={incident.mediaUrl}
                alt="Incident media"
                fill
                className="rounded-md object-cover"
                data-ai-hint="emergency disaster"
              />
            </div>
          ) : incident.mediaUrl.startsWith('data:audio') ? (
            <audio controls src={incident.mediaUrl} className="w-full h-10">
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
            <p className="text-xs text-muted-foreground/80 italic">"{incident.severity.description}"</p>
        )}
        {incident.authenticity && (
          <>
            <Separator className="my-2" />
            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center">
                        {incident.authenticity.isAuthentic ? <ShieldCheck className="w-4 h-4 mr-1 text-green-400"/> : <ShieldAlert className="w-4 h-4 mr-1 text-red-400"/>}
                        Authenticity
                    </span>
                    <span className={`font-bold ${getAuthenticityColor(incident.authenticity.confidenceScore)}`}>
                        {(incident.authenticity.confidenceScore * 100).toFixed(0)}% Confident
                    </span>
                </div>
                <p className="text-xs text-muted-foreground/80 italic">"{incident.authenticity.explanation}"</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}