import { DashboardLayout } from "../layouts/DashboardLayout";
import { FileText, Download, Calendar } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";

export function Reports() {
  const reports = [
    { id: 1, name: "Daily Shift Report - Zone A", date: "2026-08-31", type: "PDF", size: "2.4 MB" },
    { id: 2, name: "Weekly Subsidence Risk Analysis", date: "2026-08-28", type: "PDF", size: "5.1 MB" },
    { id: 3, name: "Monthly Sensor Calibration Log", date: "2026-08-01", type: "CSV", size: "1.2 MB" },
    { id: 4, name: "Incident Report - MG-05 Threshold Breach", date: "2026-07-15", type: "PDF", size: "1.8 MB" },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-mine-text tracking-tight">Automated Reports</h1>
            <p className="text-mine-muted mt-1">Generated safety and compliance documentation</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-mine-panel border border-mine-border rounded hover:bg-mine-border/50 transition-colors text-sm font-bold tracking-widest text-mine-text">
            <Calendar className="h-4 w-4" /> GENERATE NEW
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {reports.map((report) => (
            <Card key={report.id} className="bg-mine-panel hover:border-semantic-cyan/50 transition-colors group">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded bg-mine-dark flex items-center justify-center border border-mine-border text-semantic-cyan group-hover:scale-110 transition-transform">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-mine-text group-hover:text-semantic-cyan transition-colors">{report.name}</h3>
                    <p className="text-xs text-mine-muted flex items-center gap-2">
                      <span>{report.date}</span>
                      <span>•</span>
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                    </p>
                  </div>
                </div>
                <button className="h-8 w-8 rounded flex items-center justify-center bg-mine-dark hover:bg-semantic-cyan/20 hover:text-semantic-cyan transition-colors text-mine-muted">
                  <Download className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
