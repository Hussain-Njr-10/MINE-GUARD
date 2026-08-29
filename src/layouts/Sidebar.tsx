import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  FileText, 
  LayoutDashboard, 
  Map, 
  Settings 
} from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-mine-panel border-r border-mine-border h-screen flex flex-col fixed left-0 top-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-mine-border">
        <div className="flex items-center gap-2 text-semantic-cyan">
          <Activity className="h-6 w-6" />
          <span className="font-bold text-lg tracking-wider text-mine-text">MINE GUARDS</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <a href="#" className="flex items-center gap-3 px-3 py-2 bg-semantic-cyan/10 text-semantic-cyan rounded-md group">
          <LayoutDashboard className="h-5 w-5" />
          <span className="font-medium">Dashboard</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-mine-muted hover:text-mine-text hover:bg-mine-border/50 rounded-md group transition-colors">
          <Activity className="h-5 w-5" />
          <span className="font-medium">Live Monitoring</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-mine-muted hover:text-mine-text hover:bg-mine-border/50 rounded-md group transition-colors">
          <Map className="h-5 w-5" />
          <span className="font-medium">Risk Map</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-mine-muted hover:text-mine-text hover:bg-mine-border/50 rounded-md group transition-colors">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">Alerts</span>
          <span className="ml-auto bg-semantic-red text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-mine-muted hover:text-mine-text hover:bg-mine-border/50 rounded-md group transition-colors">
          <BarChart3 className="h-5 w-5" />
          <span className="font-medium">Historical Data</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-mine-muted hover:text-mine-text hover:bg-mine-border/50 rounded-md group transition-colors">
          <FileText className="h-5 w-5" />
          <span className="font-medium">Reports</span>
        </a>
      </nav>

      <div className="p-4 border-t border-mine-border">
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-mine-muted hover:text-mine-text hover:bg-mine-border/50 rounded-md group transition-colors">
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </a>
      </div>
    </aside>
  );
}
