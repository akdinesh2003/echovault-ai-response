'use client';

import React, { useState, useMemo } from 'react';
import type { IncidentReport } from '@/lib/types';
import IncidentDetails from '@/components/incident-details';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

function IncidentListItem({ incident }: { incident: IncidentReport }) {
  return (
    <div className="p-4 border-b border-border/80 hover:bg-accent/50 transition-colors">
      <IncidentDetails incident={incident} />
    </div>
  );
}

type SeverityFilter = 'all' | 'low' | 'medium' | 'high';

export default function IncidentFeed({ incidents }: { incidents: IncidentReport[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');

  const filteredIncidents = useMemo(() => {
    return incidents
      .filter((incident) => {
        if (searchTerm && !incident.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        if (severityFilter === 'all') {
          return true;
        }
        const score = incident.severity?.score ?? 0;
        if (severityFilter === 'low' && score >= 4) {
          return false;
        }
        if (severityFilter === 'medium' && (score < 4 || score >= 7)) {
          return false;
        }
        if (severityFilter === 'high' && score < 7) {
          return false;
        }
        return true;
      });
  }, [incidents, searchTerm, severityFilter]);

  return (
    <div className='flex flex-col h-full'>
        <div className="p-4 space-y-4 border-b border-border">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search incidents..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-4 gap-2">
                <Button
                    variant={severityFilter === 'all' ? 'secondary' : 'ghost'}
                    onClick={() => setSeverityFilter('all')}
                    className="h-8 text-xs"
                >
                    All
                </Button>
                <Button
                    variant={severityFilter === 'low' ? 'secondary' : 'ghost'}
                    onClick={() => setSeverityFilter('low')}
                    className="h-8 text-xs"
                >
                    Low
                </Button>
                <Button
                    variant={severityFilter === 'medium' ? 'secondary' : 'ghost'}
                    onClick={() => setSeverityFilter('medium')}
                    className="h-8 text-xs"
                >
                    Medium
                </Button>
                <Button
                    variant={severityFilter === 'high' ? 'secondary' : 'ghost'}
                    onClick={() => setSeverityFilter('high')}
                    className="h-8 text-xs"
                >
                    High
                </Button>
            </div>
        </div>
        <ScrollArea className="flex-1">
            {filteredIncidents.length > 0 ? (
                filteredIncidents.map((incident) => (
                    <IncidentListItem key={incident.id} incident={incident} />
                ))
            ) : (
                <div className="p-8 text-center text-muted-foreground">
                    No incidents found.
                </div>
            )}
        </ScrollArea>
    </div>
  );
}
