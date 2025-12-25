import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";
import { useCurrentPatient } from "@/hooks/use-patients";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, AlertCircle, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: patient } = useCurrentPatient();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and account settings.</p>
        </div>

        {/* Header Card */}
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="h-32 bg-gradient-to-r from-primary to-blue-600" />
          <div className="px-8 pb-8">
            <div className="relative -mt-12 mb-6 flex justify-between items-end">
              <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                <AvatarImage src={user?.profileImageUrl} />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {user?.firstName?.[0]}
                </AvatarFallback>
              </Avatar>
              <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors">
                Edit Profile
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Date of Birth</span>
                <span className="font-medium">{patient?.dateOfBirth ? format(new Date(patient.dateOfBirth), "MMMM do, yyyy") : "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Gender</span>
                <span className="font-medium capitalize">{patient?.gender || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Blood Type</span>
                <span className="font-medium">{patient?.bloodType || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Address</span>
                <span className="font-medium text-right max-w-[200px]">{patient?.address || "N/A"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" /> Medical & Emergency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Allergies</h4>
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                   {patient?.allergies || "No known allergies"}
                </div>
               </div>
               
               <Separator />
               
               <div>
                 <h4 className="text-sm font-semibold text-muted-foreground mb-3">Emergency Contact</h4>
                 <div className="space-y-2">
                   <div className="flex items-center gap-3">
                     <User className="w-4 h-4 text-muted-foreground" />
                     <span className="font-medium">{patient?.emergencyContactName || "Not set"}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <Phone className="w-4 h-4 text-muted-foreground" />
                     <span className="font-medium">{patient?.emergencyContactPhone || "Not set"}</span>
                   </div>
                 </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
