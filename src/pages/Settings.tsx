import { DashboardLayout } from "../layouts/DashboardLayout";
import { Sliders, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

export function Settings() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-12">
        <div>
          <h1 className="text-3xl font-bold text-mine-text tracking-tight">System Settings</h1>
          <p className="text-mine-muted mt-1">Configure global thresholds and system parameters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-mine-panel/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-semantic-cyan" /> Risk Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-mine-muted">Critical Tilt Angle</span>
                  <span className="text-semantic-red font-mono">8.0°</span>
                </div>
                <div className="h-2 bg-mine-dark rounded-full overflow-hidden">
                  <div className="h-full bg-semantic-red w-[80%]"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-mine-muted">Warning Displacement</span>
                  <span className="text-semantic-amber font-mono">2.5 mm</span>
                </div>
                <div className="h-2 bg-mine-dark rounded-full overflow-hidden">
                  <div className="h-full bg-semantic-amber w-[50%]"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-mine-panel/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-semantic-cyan" /> Notification Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between p-3 bg-mine-dark rounded border border-mine-border">
                <span className="text-sm font-medium">SMS Alerts (Critical)</span>
                <div className="w-10 h-5 bg-semantic-cyan rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-mine-dark rounded border border-mine-border">
                <span className="text-sm font-medium">Email Daily Reports</span>
                <div className="w-10 h-5 bg-semantic-cyan rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
