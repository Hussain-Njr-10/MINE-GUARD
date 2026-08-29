import { Bell, Search, Wifi } from "lucide-react";

export function TopHeader() {
  const currentDate = new Date().toLocaleString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <header className="h-16 bg-mine-dark border-b border-mine-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 w-full overflow-x-hidden">
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-semantic-green animate-pulse"></div>
          <span className="text-sm text-mine-muted font-medium hidden sm:inline-block">System Online</span>
        </div>
        <div className="hidden md:block h-4 w-px bg-mine-border"></div>
        <div className="hidden md:flex items-center gap-2 text-sm text-mine-muted">
          <Wifi className="h-4 w-4 text-semantic-green" />
          <span>Gateway Active</span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6 shrink-0">
        <div className="text-sm font-mono text-mine-muted hidden lg:block">
          {currentDate}
        </div>
        
        <div className="relative hidden md:block">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-mine-muted" />
          <input 
            type="text" 
            placeholder="Search nodes, zones..." 
            className="bg-mine-panel border border-mine-border rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-semantic-cyan text-mine-text w-48 lg:w-64 transition-colors"
          />
        </div>

        <button className="relative text-mine-muted hover:text-mine-text transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-semantic-red border-2 border-mine-dark"></span>
        </button>

        <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-mine-border">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-mine-text leading-tight">Admin User</span>
            <span className="text-[10px] text-mine-muted">Safety Officer</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-mine-border flex items-center justify-center text-mine-text font-bold text-sm shrink-0">
            AU
          </div>
        </div>
      </div>
    </header>
  );
}
