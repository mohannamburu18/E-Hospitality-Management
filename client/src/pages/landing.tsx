import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { ShieldCheck, Calendar, Activity, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-md bg-white/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">ML Connect</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/api/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Log In
            </a>
            <a 
              href="/api/login" 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full z-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in-up">
              <ShieldCheck className="w-4 h-4" />
              Secure Hospital Management System
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-foreground mb-6 leading-tight">
              Modern Healthcare <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Simplified & Digital
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              Manage appointments, patient records, and doctor communication in one secure, unified platform. Experience the future of medical administration.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/api/login" 
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="#features" 
                className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-bold text-lg hover:bg-secondary/80 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Feature Grid */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard 
              icon={<Calendar className="w-8 h-8 text-white" />}
              title="Smart Scheduling"
              description="Book, manage, and track appointments with ease. Automatic reminders ensure you never miss a visit."
              color="bg-blue-500"
            />
            <FeatureCard 
              icon={<Activity className="w-8 h-8 text-white" />}
              title="Digital Records"
              description="Access your complete medical history securely from anywhere. Lab results, prescriptions, and notes in one place."
              color="bg-teal-500"
            />
            <FeatureCard 
              icon={<MessageSquare className="w-8 h-8 text-white" />}
              title="Direct Communication"
              description="Connect with healthcare providers securely. Ask questions and get updates without the phone tag."
              color="bg-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/40 py-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 ML Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <div className="group p-8 rounded-3xl bg-card border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 font-display">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
