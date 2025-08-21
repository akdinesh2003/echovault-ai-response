import { getIncidents } from '@/lib/incidents-store';
import ReportForm from '@/components/report-form';
import IncidentMap from '@/components/incident-map';
import { EchoVaultLogo } from '@/components/icons';
import Link from 'next/link';

export default async function Home() {
  const incidents = await getIncidents();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex h-16 items-center border-b px-4 lg:px-6 shrink-0 z-10 bg-background">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <EchoVaultLogo className="h-6 w-6 text-primary" />
          <span className="text-lg">EchoVault</span>
        </Link>
        <div className="ml-auto">
          <p className="text-sm text-muted-foreground hidden sm:block">Report. Verify. Respond.</p>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 border-r overflow-y-auto">
            <div className="p-6">
                <h2 className="text-2xl font-bold tracking-tight">Report an Emergency</h2>
                <p className="text-muted-foreground mb-4">Your report helps keep the community safe.</p>
                <ReportForm />
            </div>
        </aside>
        <main className="flex-1 relative">
          <IncidentMap incidents={incidents} />
        </main>
      </div>
    </div>
  );
}
