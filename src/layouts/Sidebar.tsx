import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  FileText, 
  LayoutDashboard, 
  Map, 
  Settings 
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTelemetry } from "../hooks/useTelemetry";

export function Sidebar() {
  const { alerts } = useTelemetry();
  // Count active warnings and criticals
  const activeAlerts = alerts.filter(a => a.state === 'CRITICAL' || a.state === 'WARNING').length;

  return (
    <aside className="w-64 bg-mine-panel border-r border-mine-border h-screen flex flex-col fixed left-0 top-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-mine-border">
        <div className="flex items-center gap-2 text-semantic-cyan">
          <Activity className="h-6 w-6" />
          <span className="font-bold text-lg tracking-wider text-mine-text">MINE GUARDS</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <NavLink 
          to="/" 
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
