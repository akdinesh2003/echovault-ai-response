import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { IncidentReport } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ShieldCheck, ShieldAlert, BadgeInfo, User, UserX, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface IncidentDetailsProps {
  incident: IncidentReport;
}

export default function IncidentDetails({ incident }: IncidentDetailsProps) {
  const getSeverityInfo = (score: number) => {
    if (score >= 7) return { 
        variant: 'destructive', 
        label: 'High',
        Icon: AlertTriangle,
        className: 'bg-red-800/20 text-red-400 border-red-800/50' 
    };
    if (score >= 4) return { 
        variant: 'secondary', 
        label: 'Medium',
        Icon: AlertTriangle,
        className: 'bg-yellow-800/20 text-yellow-400 border-yellow-800/50'
    };
    return { 
        variant: 'default', 
        label: 'Low',
        Icon: CheckCircle,
        className: 'bg-green-800/20 text-green-400 border-green-800/50' 
    };
  };

  const getAuthenticityColor = (score: number) => {
    if (score > 0.75) return 'text-green-400';
    if (score > 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const severity = incident.severity ? getSeverityInfo(incident.severity.score) : null;

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="p-0">
        <div className="flex justify-between items-start">
            <CardTitle className="text-base font-medium pr-4">{incident.description}</CardTitle>
            {severity && (
              <Badge variant={severity.variant as any} className={`flex-shrink-0 ${severity.className}`}>
                <severity.Icon className="w-3.5 h-3.5 mr-1.5" />
                {severity.label}
              </Badge>
            )}
        </div>
        <CardDescription className="flex items-center justify-between text-xs pt-1">
          <span>Reported {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}</span>
          <span className='flex items-center gap-1.5'>
            {incident.isAnonymous ? <UserX className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            {incident.isAnonymous ? "Anonymous" : "Verified"}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 mt-4 space-y-4">
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
        
        {incident.severity && (
            <div className="flex justify-between items-center text-sm p-2 bg-secondary/50 rounded-md">
                <span className="text-muted-foreground flex items-center"><Info className="w-4 h-4 mr-2" />Severity Score</span>
                <span className="font-bold text-lg">{incident.severity?.score}/10</span>
            </div>
        )}

        {incident.authenticity && (
          <>
            <Separator />
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center">
                        {incident.authenticity.isAuthentic ? <ShieldCheck className="w-4 h-4 mr-2 text-green-400"/> : <ShieldAlert className="w-4 h-4 mr-2 text-red-400"/>}
                        Authenticity
                    </span>
                    <span className={`font-bold ${getAuthenticityColor(incident.authenticity.confidenceScore)}`}>
                        {(incident.authenticity.confidenceScore * 100).toFixed(0)}% Confident
                    </span>
                </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
