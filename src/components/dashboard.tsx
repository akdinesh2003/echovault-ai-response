'use client';

import React, { useMemo } from 'react';
import type { IncidentReport } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { AlertTriangle, CheckCircle, List, User, UserX } from 'lucide-react';

export default function Dashboard({ incidents }: { incidents: IncidentReport[] }) {
  const stats = useMemo(() => {
    const total = incidents.length;
    const high = incidents.filter(i => (i.severity?.score ?? 0) >= 7).length;
    const medium = incidents.filter(i => (i.severity?.score ?? 0) >= 4 && (i.severity?.score ?? 0) < 7).length;
    const low = incidents.filter(i => (i.severity?.score ?? 0) < 4).length;
    const anonymous = incidents.filter(i => i.isAnonymous).length;
    const verified = total - anonymous;

    const severityData = [
      { name: 'Low', value: low, fill: 'var(--color-low)' },
      { name: 'Medium', value: medium, fill: 'var(--color-medium)' },
      { name: 'High', value: high, fill: 'var(--color-high)' },
    ];
    
    const reporterData = [
        { name: 'Verified', value: verified, fill: 'var(--color-verified)' },
        { name: 'Anonymous', value: anonymous, fill: 'var(--color-anonymous)' },
    ];

    return { total, high, medium, low, anonymous, verified, severityData, reporterData };
  }, [incidents]);

  const COLORS = {
      low: 'hsl(143, 60%, 50%)',
      medium: 'hsl(48, 95%, 60%)',
      high: 'hsl(0, 85%, 60%)',
      verified: 'hsl(217, 91%, 60%)',
      anonymous: 'hsl(215, 28%, 17%)'
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.high}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Reports</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verified}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Severity</CardTitle>
            <CardDescription>A breakdown of incidents based on their severity score.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
                <style>{`:root { --color-low: ${COLORS.low}; --color-medium: ${COLORS.medium}; --color-high: ${COLORS.high} }`}</style>
                <BarChart data={stats.severityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                    <Tooltip
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            color: "hsl(var(--foreground))"
                        }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reporter Type</CardTitle>
            <CardDescription>Distribution of anonymous vs verified reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
                 <style>{`:root { --color-verified: ${COLORS.verified}; --color-anonymous: ${COLORS.anonymous}; }`}</style>
                <PieChart>
                    <Pie data={stats.reporterData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                       {stats.reporterData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.fill} />
                       ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            color: "hsl(var(--foreground))"
                        }}
                    />
                    <Legend iconType='circle' />
                </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
