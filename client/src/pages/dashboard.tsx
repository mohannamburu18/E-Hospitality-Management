import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";
import { useAppointments } from "@/hooks/use-appointments";
import { useMedicalRecords } from "@/hooks/use-medical-records";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Activity, Clock, FileText, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: appointments } = useAppointments();
  const { data: records } = useMedicalRecords();

  const upcomingAppointments = appointments?.filter(a => a.status === 'pending' || a.status === 'confirmed') || [];
  const nextAppointment = upcomingAppointments[0];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Good Morning, {user?.firstName}
            </h1>
            <p className="text-muted-foreground mt-1">Here's your health overview for today.</p>
          </div>
          <Link href="/appointments">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Book Appointment
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<Calendar className="w-6 h-6 text-blue-600" />}
            label="Upcoming Visits"
            value={upcomingAppointments.length.toString()}
            color="bg-blue-50"
          />
          <StatCard 
            icon={<FileText className="w-6 h-6 text-teal-600" />}
            label="Medical Records"
            value={records?.length.toString() || "0"}
            color="bg-teal-50"
          />
          <StatCard 
            icon={<Clock className="w-6 h-6 text-purple-600" />}
            label="Pending Results"
            value="0"
            color="bg-purple-50"
          />
          <StatCard 
            icon={<Activity className="w-6 h-6 text-orange-600" />}
            label="Health Score"
            value="98%"
            color="bg-orange-50"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Next Appointment Card */}
          <Card className="lg:col-span-2 border-none shadow-lg bg-gradient-to-br from-primary to-blue-600 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white/90">
                <Calendar className="w-5 h-5" /> Next Appointment
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextAppointment ? (
                <div className="space-y-4 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h3 className="text-3xl font-bold font-display">{format(new Date(nextAppointment.date), "EEEE, MMMM do")}</h3>
                      <p className="text-white/80 text-lg mt-1">at {nextAppointment.time}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 min-w-[200px]">
                      <p className="text-xs text-white/70 uppercase font-semibold tracking-wider mb-1">Doctor</p>
                      <p className="font-semibold text-lg">Dr. {nextAppointment.doctor.user.lastName}</p>
                      <p className="text-sm text-white/80">{nextAppointment.doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/20 flex gap-4">
                     <button className="px-4 py-2 bg-white text-primary rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors">
                        Reschedule
                     </button>
                     <button className="px-4 py-2 bg-white/10 text-white rounded-lg font-semibold text-sm hover:bg-white/20 transition-colors">
                        Cancel
                     </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-white/80">
                  <p className="text-lg">No upcoming appointments</p>
                  <Link href="/appointments">
                    <button className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors">
                      Schedule One Now
                    </button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions / Recent Activity */}
          <Card className="shadow-md border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Recent Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {records && records.length > 0 ? (
                  records.slice(0, 3).map((record) => (
                    <div key={record.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group">
                      <div className="p-2 bg-teal-100 text-teal-600 rounded-lg group-hover:bg-teal-200 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{record.diagnosis}</h4>
                        <p className="text-xs text-muted-foreground">Dr. {record.doctor.user.lastName} • {format(new Date(record.visitDate!), "MMM d")}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No records found</p>
                )}
                
                <Link href="/records">
                  <div className="w-full mt-4 py-2 text-center text-sm font-medium text-primary hover:bg-primary/5 rounded-lg cursor-pointer transition-colors">
                    View All Records
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <h3 className="text-2xl font-bold font-display mt-1">{value}</h3>
      </div>
    </div>
  );
}
