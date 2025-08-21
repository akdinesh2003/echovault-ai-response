import { getIncidents } from '@/lib/incidents-store';
import ReportForm from '@/components/report-form';
import IncidentMap from '@/components/incident-map';
import { EchoVaultLogo } from '@/components/icons';
import Link from 'next/link';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarInset, SidebarFooter } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PlusCircle, LayoutDashboard, List } from 'lucide-react';
import IncidentFeed from '@/components/incident-feed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Dashboard from '@/components/dashboard';

export default async function Home() {
  const incidents = await getIncidents();

  return (
    <SidebarProvider>
      <div className="fixed inset-0 bg-background/50 bg-[url('/grid-dark.svg')] bg-center bg-repeat -z-10" />
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <EchoVaultLogo className="h-6 w-6 text-primary" />
            <span className="text-lg tracking-tight">EchoVault</span>
          </Link>
        </SidebarHeader>
        <Tabs defaultValue="feed" className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-4 mt-2">
            <TabsTrigger value="feed" className="w-full gap-2">
              <List className="h-4 w-4" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="w-full gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>
          <TabsContent value="feed" className="flex-1 overflow-y-auto">
            <IncidentFeed incidents={incidents} />
          </TabsContent>
          <TabsContent value="dashboard" className="flex-1 overflow-y-auto p-4">
            <Dashboard incidents={incidents} />
          </TabsContent>
        </Tabs>
        <SidebarFooter>
             <Sheet>
              <SheetTrigger asChild>
                <Button className="w-full">
                  <PlusCircle className="mr-2" />
                  New Report
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-background/95 backdrop-blur-sm">
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
