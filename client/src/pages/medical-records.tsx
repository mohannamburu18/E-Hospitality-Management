import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useMedicalRecords } from "@/hooks/use-medical-records";
import { format } from "date-fns";
import { FileText, Stethoscope, Pill, ClipboardList } from "lucide-react";

export default function MedicalRecordsPage() {
  const { data: records, isLoading } = useMedicalRecords();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Medical Records</h1>
          <p className="text-muted-foreground">Access your complete history, diagnoses, and treatments.</p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">Loading records...</div>
        ) : records?.length === 0 ? (
          <div className="py-20 text-center bg-card rounded-2xl border border-dashed border-border">
            <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No records found</h3>
            <p className="text-muted-foreground">Your medical history will appear here after your visits.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {records?.map((record) => (
              <div key={record.id} className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 border-b border-border/50 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary">{record.diagnosis}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Attending Doctor: <span className="font-medium text-foreground">Dr. {record.doctor.user.lastName} ({record.doctor.specialty})</span>
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium">
                    Date: {format(new Date(record.visitDate!), "MMMM do, yyyy")}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mt-0.5">
                        <Pill className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">Prescription</h4>
                        <p className="text-foreground leading-relaxed">{record.prescription}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-start gap-3">
                      <div className="p-2 bg-teal-100 text-teal-600 rounded-lg mt-0.5">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">Treatment Plan</h4>
                        <p className="text-foreground leading-relaxed">{record.treatmentPlan || "No specific treatment plan recorded."}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {record.testResults && (
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Test Results</h4>
                    <div className="bg-secondary/50 p-4 rounded-xl border border-border/50 font-mono text-sm">
                      {record.testResults}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
