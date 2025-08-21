import { getIncidents } from '@/lib/incidents-store';
import ReportForm from '@/components/report-form';
import IncidentMap from '@/components/incident-map';
import { EchoVaultLogo } from '@/components/icons';
import Link from 'next/link';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarInset, SidebarFooter } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { IncidentReport } from '@/lib/types';
import IncidentDetails from '@/components/incident-details';

function IncidentListItem({ incident }: { incident: IncidentReport }) {
  return (
    <div className="p-4 border-b border-border">
      <IncidentDetails incident={incident} />
    </div>
  );
}

export default async function Home() {
  const incidents = await getIncidents();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <EchoVaultLogo className="h-6 w-6 text-primary" />
            <span className="text-lg">EchoVault</span>
          </Link>
        </SidebarHeader>
        <ScrollArea className="flex-1">
            <SidebarContent>
                <div className="p-4">
                    <h2 className="text-xl font-semibold tracking-tight">Recent Incidents</h2>
                    <p className="text-muted-foreground text-sm">Live feed of reported events</p>
                </div>
                <div>
                    {incidents.map((incident) => (
                        <IncidentListItem key={incident.id} incident={incident} />
                    ))}
                </div>
            </SidebarContent>
        </ScrollArea>
        <SidebarFooter>
             <Sheet>
              <SheetTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2" />
                  New Report
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Report an Emergency</SheetTitle>
                  <SheetDescription>
                    Your report helps keep the community safe. Please provide as much detail as possible.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <ReportForm />
                </div>
              </SheetContent>
            </Sheet>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center border-b px-4 lg:px-6 shrink-0 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="md:hidden" />
            <div className="ml-auto">
              <p className="text-sm text-muted-foreground hidden sm:block">Report. Verify. Respond.</p>
            </div>
          </header>
          <main className="flex-1 relative">
            <IncidentMap incidents={incidents} />
          </main>
      </SidebarInset>
    </SidebarProvider>
  );
}