import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAppointments, useCreateAppointment } from "@/hooks/use-appointments";
import { useDoctors } from "@/hooks/use-doctors";
import { useCurrentPatient } from "@/hooks/use-patients";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema } from "@shared/routes";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, User, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Schema for the form
const formSchema = insertAppointmentSchema.extend({
  doctorId: z.coerce.number(), // Ensure number
  patientId: z.coerce.number(),
});

export default function AppointmentsPage() {
  const { data: appointments, isLoading } = useAppointments();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Appointments</h1>
            <p className="text-muted-foreground">Manage your visits and schedule new consultations.</p>
          </div>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 h-12 px-6 rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" /> Book New
          </Button>
        </div>

        {/* Filters & Search - Visual Only for now */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search appointments..." className="pl-10 rounded-xl bg-card border-border/50" />
          </div>
        </div>

        {/* Appointments List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
             <div className="col-span-full py-20 text-center text-muted-foreground">Loading appointments...</div>
          ) : appointments?.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-card rounded-2xl border border-dashed border-border">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No appointments yet</h3>
              <p className="text-muted-foreground mb-6">Schedule your first consultation with our doctors.</p>
              <Button variant="outline" onClick={() => setIsCreateOpen(true)}>Book Now</Button>
            </div>
          ) : (
            appointments?.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))
          )}
        </div>

        <CreateAppointmentDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      </div>
    </DashboardLayout>
  );
}

function AppointmentCard({ appointment }: { appointment: any }) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {format(new Date(appointment.date), "d")}
          </div>
          <div>
            <h4 className="font-bold text-lg">Dr. {appointment.doctor.user.lastName}</h4>
            <p className="text-sm text-muted-foreground">{appointment.doctor.specialty}</p>
          </div>
        </div>
        <span className={cn("px-3 py-1 rounded-full text-xs font-semibold border", statusColors[appointment.status as keyof typeof statusColors])}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="w-4 h-4" />
          {format(new Date(appointment.date), "MMMM do, yyyy")}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {appointment.time}
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2">
          <span className="font-medium text-foreground">Reason:</span> {appointment.reason}
        </div>
      </div>

      <div className="pt-4 border-t border-border/50 flex gap-2">
        <Button variant="outline" className="flex-1 rounded-lg text-xs h-9">Reschedule</Button>
        <Button variant="destructive" className="flex-1 rounded-lg text-xs h-9 bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none">Cancel</Button>
      </div>
    </div>
  );
}

function CreateAppointmentDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { data: doctors } = useDoctors();
  const { data: patient } = useCurrentPatient();
  const { mutateAsync: createAppointment, isPending } = useCreateAppointment();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: 0, 
      doctorId: 0,
      date: "",
      time: "",
      reason: "",
      notes: "",
    },
  });

  // Update patientId when patient data loads
  if (patient && form.getValues("patientId") === 0) {
    form.setValue("patientId", patient.id);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!patient) return;
    try {
      await createAppointment(values);
      toast({ title: "Appointment Requested", description: "We'll notify you when it's confirmed." });
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Book New Appointment</DialogTitle>
          <DialogDescription>Choose a doctor and time for your consultation.</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Doctor</FormLabel>
                  <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Choose a specialist" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors?.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id.toString()}>
                          Dr. {doc.user.lastName} - {doc.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Visit</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Annual checkup, Fever..." {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any specific symptoms or questions?" {...field} value={field.value || ""} className="rounded-xl resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button type="submit" className="w-full rounded-xl h-11" disabled={isPending}>
                {isPending ? "Booking..." : "Confirm Appointment"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
