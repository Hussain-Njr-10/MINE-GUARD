import { useState, useEffect, useRef } from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { useTelemetry } from "../hooks/useTelemetry";
import { AlertTriangle, AlertOctagon, X, Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { alerts } = useTelemetry();
  const [activeToast, setActiveToast] = useState<{ id: string; nodeId: string; state: string; message: string; timestamp: string } | null>(null);
  const [flashColor, setFlashColor] = useState<'red' | 'amber' | null>(null);
  const lastAlertId = useRef<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (alerts.length > 0) {
      const latestAlert = alerts[0];
      
      // If we see a new alert that we haven't processed yet
      if (lastAlertId.current !== latestAlert.id) {
        lastAlertId.current = latestAlert.id;
        
        // Only trigger for WARNING or CRITICAL
        if (latestAlert.state === 'CRITICAL' || latestAlert.state === 'WARNING') {
          setActiveToast(latestAlert);
          setFlashColor(latestAlert.state === 'CRITICAL' ? 'red' : 'amber');
          
          // Clear the flash effect quickly
          setTimeout(() => setFlashColor(null), 800);
          
          // Auto-hide toast after 5 seconds
          setTimeout(() => setActiveToast(null), 5000);
        }
      }
    }
  }, [alerts]);

  return (
    <div className="min-h-screen flex bg-mine-dark relative">
      
      {/* Screen Flash Overlay */}
      {flashColor && (
        <div 
          className={`fixed inset-0 z-50 pointer-events-none transition-colors duration-500 ease-out 
            ${flashColor === 'red' ? 'bg-semantic-red/20' : 'bg-semantic-amber/20'}`} 
        />
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {activeToast && (
        <div className={`fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300 w-80 rounded-lg shadow-2xl border ${activeToast.state === 'CRITICAL' ? 'bg-semantic-red/10 border-semantic-red/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-semantic-amber/10 border-semantic-amber/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]'}`}>
          <div className="p-4 backdrop-blur-md bg-mine-dark/80 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {activeToast.state === 'CRITICAL' ? (
                  <AlertOctagon className="h-6 w-6 text-semantic-red animate-pulse" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-semantic-amber animate-pulse" />
                )}
                <div>
                  <h4 className={`text-sm font-bold uppercase tracking-widest ${activeToast.state === 'CRITICAL' ? 'text-semantic-red' : 'text-semantic-amber'}`}>
                    {activeToast.state} ALERT: {activeToast.nodeId}
                  </h4>
                  <p className="text-xs text-mine-muted mt-1">{activeToast.message}</p>
                </div>
              </div>
              <button onClick={() => setActiveToast(null)} className="text-mine-muted hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:block ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      <div className="flex-1 lg:ml-64 flex flex-col w-full overflow-hidden">
        <TopHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-6 overflow-auto relative z-0">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
