import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex bg-mine-dark">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="flex-1 lg:ml-64 flex flex-col w-full overflow-hidden">
        <TopHeader />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
