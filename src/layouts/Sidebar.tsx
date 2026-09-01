import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  FileText, 
  LayoutDashboard, 
  Map, 
  Settings,
  X
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTelemetry } from "../hooks/useTelemetry";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { alerts } = useTelemetry();
  // Count active warnings and criticals
  const activeAlerts = alerts.filter(a => a.state === 'CRITICAL' || a.state === 'WARNING').length;

  return (
    <aside className="w-64 bg-mine-panel border-r border-mine-border h-screen flex flex-col z-20 shadow-2xl lg:shadow-none">
      <div className="h-16 flex items-center justify-between px-6 border-b border-mine-border">
        <div className="flex items-center gap-2 text-semantic-cyan">
          <Activity className="h-6 w-6" />
          <span className="font-bold text-lg tracking-wider text-mine-text">MINE GUARDS</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="lg:hidden p-1.5 -mr-1.5 text-mine-muted hover:text-white rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <NavLink 
          to="/" 
          onClick={onClose}
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md group transition-colors ${
              isActive ? "bg-semantic-cyan/10 text-semantic-cyan" : "text-mine-muted hover:text-mine-text hover:bg-mine-border/50"
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="font-medium">Dashboard</span>
        </NavLink>
        <NavLink 
          to="/live" 
          onClick={onClose}
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md group transition-colors ${
              isActive ? "bg-semantic-cyan/10 text-semantic-cyan" : "text-mine-muted hover:text-mine-text hover:bg-mine-border/50"
            }`
          }
        >
          <Activity className="h-5 w-5" />
          <span className="font-medium">Live Monitoring</span>
        </NavLink>
        <NavLink 
          to="/map" 
          onClick={onClose}
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md group transition-colors ${
              isActive ? "bg-semantic-cyan/10 text-semantic-cyan" : "text-mine-muted hover:text-mine-text hover:bg-mine-border/50"
            }`
          }
        >
          <Map className="h-5 w-5" />
          <span className="font-medium">Risk Map</span>
        </NavLink>
        <NavLink 
          to="/alerts" 
          onClick={onClose}
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md group transition-colors ${
              isActive ? "bg-semantic-cyan/10 text-semantic-cyan" : "text-mine-muted hover:text-mine-text hover:bg-mine-border/50"
            }`
          }
        >
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">Alerts</span>
          {activeAlerts > 0 && (
            <span className="ml-auto bg-semantic-red text-white text-xs px-1.5 py-0.5 rounded-full">{activeAlerts}</span>
          )}
        </NavLink>
        <NavLink 
          to="/history" 
          onClick={onClose}
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md group transition-colors ${
              isActive ? "bg-semantic-cyan/10 text-semantic-cyan" : "text-mine-muted hover:text-mine-text hover:bg-mine-border/50"
            }`
          }
        >
          <BarChart3 className="h-5 w-5" />
          <span className="font-medium">Historical Data</span>
        </NavLink>
        <NavLink 
          to="/reports" 
          onClick={onClose}
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md group transition-colors ${
              isActive ? "bg-semantic-cyan/10 text-semantic-cyan" : "text-mine-muted hover:text-mine-text hover:bg-mine-border/50"
            }`
          }
        >
          <FileText className="h-5 w-5" />
          <span className="font-medium">Reports</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-mine-border">
        <NavLink 
          to="/settings" 
          onClick={onClose}
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-md group transition-colors ${
              isActive ? "bg-semantic-cyan/10 text-semantic-cyan" : "text-mine-muted hover:text-mine-text hover:bg-mine-border/50"
            }`
          }
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
