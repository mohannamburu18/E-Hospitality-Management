import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useCurrentPatient } from "@/hooks/use-patients";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: patient, isLoading: isPatientLoading } = useCurrentPatient();
  
  if (isAuthLoading || isPatientLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is authenticated but hasn't completed patient profile
  if (user && !patient && window.location.pathname !== '/onboarding') {
    // Basic redirect logic handled in App.tsx or protected route component usually,
    // but here we can just show a prompt.
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          To access the dashboard, we need some additional medical information to set up your patient record.
        </p>
        <Link href="/onboarding" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Setup Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar className="hidden md:flex w-64 flex-shrink-0" />
      
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Nav Overlay could go here */}
    </div>
  );
}
