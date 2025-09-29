import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Clock, AlertTriangle, CheckCircle, Activity } from "lucide-react";

type DiagnosisRecord = {
  id: string;
  risk_level: string;
  created_at: string;
  age: number;
  sex: string;
  bmi: number;
  probability_healthy: number;
  probability_moderate: number;
  probability_severe: number;
};

const History = () => {
  const navigate = useNavigate();
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from("diagnoses")
          .select("id, risk_level, created_at, age, sex, bmi, probability_healthy, probability_moderate, probability_severe")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setDiagnoses(data || []);
      } catch (error) {
        console.error("Error fetching history:", error);
        toast.error("Failed to load diagnosis history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "healthy":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Healthy
          </Badge>
        );
      case "moderate":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Moderate Risk
          </Badge>
        );
      case "severe":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Severe Risk
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Diagnosis History
          </h1>
          <p className="text-muted-foreground">
            View all your past heart disease risk assessments
          </p>
        </div>

        {diagnoses.length === 0 ? (
          <Card className="p-12 text-center">
            <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Diagnoses Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't completed any diagnoses. Start your first assessment now!
            </p>
            <Button onClick={() => navigate("/diagnosis")}>
              Start New Diagnosis
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {diagnoses.map((diagnosis) => (
              <Card
                key={diagnosis.id}
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/results/${diagnosis.id}`)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getRiskBadge(diagnosis.risk_level)}
                      <span className="text-sm text-muted-foreground">
                        {new Date(diagnosis.created_at).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                      <div>
                        <span className="text-muted-foreground block">Age</span>
                        <span className="font-medium">{diagnosis.age} years</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Sex</span>
                        <span className="font-medium capitalize">{diagnosis.sex}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">BMI</span>
                        <span className="font-medium">{diagnosis.bmi}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Highest Risk</span>
                        <span className="font-medium">
                          {Math.max(
                            diagnosis.probability_healthy,
                            diagnosis.probability_moderate,
                            diagnosis.probability_severe
                          ) === diagnosis.probability_healthy && "Healthy"}
                          {Math.max(
                            diagnosis.probability_healthy,
                            diagnosis.probability_moderate,
                            diagnosis.probability_severe
                          ) === diagnosis.probability_moderate && "Moderate"}
                          {Math.max(
                            diagnosis.probability_healthy,
                            diagnosis.probability_moderate,
                            diagnosis.probability_severe
                          ) === diagnosis.probability_severe && "Severe"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;