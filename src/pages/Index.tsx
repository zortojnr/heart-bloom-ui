import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Heart, History, LogOut, UserCircle } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Activity className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Heart Disease Diagnostic System</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Risk Assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <UserCircle className="h-4 w-4" />
              <span className="hidden md:inline">{user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
            <Heart className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Welcome to Your Health Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get AI-powered heart disease risk assessments based on your clinical data and medical history
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate("/diagnosis")}>
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                <Activity className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">New Diagnosis</h3>
              <p className="text-muted-foreground mb-6">
                Start a comprehensive heart disease risk assessment
              </p>
              <Button className="w-full">
                Begin Assessment
              </Button>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate("/history")}>
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-accent/10 rounded-full mb-4 group-hover:bg-accent/20 transition-colors">
                <History className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">View History</h3>
              <p className="text-muted-foreground mb-6">
                Access your past diagnoses and track your health progress
              </p>
              <Button variant="outline" className="w-full">
                View Records
              </Button>
            </div>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-success/10 rounded">
                <Activity className="h-5 w-5 text-success" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Accurate Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  AI-powered diagnosis using advanced medical algorithms
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent/10 rounded">
                <Heart className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Comprehensive Reports</h4>
                <p className="text-sm text-muted-foreground">
                  Detailed risk assessment with probability distributions
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-warning/10 rounded">
                <History className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Track Progress</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor your health trends over time
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
