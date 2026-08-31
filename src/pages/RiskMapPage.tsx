import { DashboardLayout } from "../layouts/DashboardLayout";
import { RiskMap } from "../components/dashboard/RiskMap";
import { useNavigate } from "react-router-dom";

export function RiskMapPage() {
  const navigate = useNavigate();

  const handleNodeSelect = (nodeId: string) => {
    navigate(`/node/${nodeId}`);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-12 h-full">
        <div>
          <h1 className="text-3xl font-bold text-mine-text tracking-tight">Interactive Risk Map</h1>
          <p className="text-mine-muted mt-1">Geospatial overview of mine subsidence risk zones</p>
        </div>
        
        <div className="flex-1 min-h-[600px] border border-mine-border rounded-xl overflow-hidden shadow-lg bg-mine-panel/30">
          <RiskMap 
             onNodeSelect={handleNodeSelect} 
             selectedNodeId="" 
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
