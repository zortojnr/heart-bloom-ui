import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Activity, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Diagnosis = {
  id: string;
  risk_level: string;
  probability_healthy: number;
  probability_moderate: number;
  probability_severe: number;
  key_factors: string;
  created_at: string;
  age: number;
  sex: string;
  bmi: number;
};

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("diagnoses")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setDiagnosis(data);
      } catch (error) {
        console.error("Error fetching diagnosis:", error);
        toast.error("Failed to load diagnosis results");
        navigate("/history");
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!diagnosis) {
    return null;
  }

  const getRiskConfig = (level: string) => {
    switch (level) {
      case "healthy":
        return {
          icon: CheckCircle,
          color: "text-success",
          bgColor: "bg-success/10",
          borderColor: "border-success/20",
          label: "Healthy",
          message: "Your heart health indicators are within normal ranges. Continue maintaining a healthy lifestyle!",
        };
      case "moderate":
        return {
          icon: AlertTriangle,
          color: "text-warning",
          bgColor: "bg-warning/10",
          borderColor: "border-warning/20",
          label: "Moderate Risk",
          message: "Some risk factors have been identified. We recommend consulting with a healthcare provider for preventive measures.",
        };
      case "severe":
        return {
          icon: AlertTriangle,
          color: "text-destructive",
          bgColor: "bg-destructive/10",
          borderColor: "border-destructive/20",
          label: "Severe Risk",
          message: "Multiple significant risk factors detected. Please seek immediate medical attention for proper evaluation and treatment.",
        };
      default:
        return {
          icon: Activity,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          borderColor: "border-muted",
          label: "Unknown",
          message: "",
        };
    }
  };

  const config = getRiskConfig(diagnosis.risk_level);
  const Icon = config.icon;
  const keyFactorsList = diagnosis.key_factors.split("; ");

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Risk Status Card */}
        <Card className={`p-8 mb-6 ${config.bgColor} border-2 ${config.borderColor}`}>
          <div className="flex flex-col items-center text-center">
            <Icon className={`h-16 w-16 ${config.color} mb-4`} />
            <h1 className="text-3xl font-bold mb-2">
              Diagnosis Complete
            </h1>
            <Badge variant="outline" className={`text-lg px-4 py-2 ${config.color} border-current`}>
              {config.label}
            </Badge>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              {config.message}
            </p>
          </div>
        </Card>

        {/* Probability Distribution */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Risk Probability Distribution
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium">Healthy</span>
                <span className="text-success">{(diagnosis.probability_healthy * 100).toFixed(1)}%</span>
              </div>
              <Progress 
                value={diagnosis.probability_healthy * 100} 
                className="h-3"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium">Moderate Risk</span>
                <span className="text-warning">{(diagnosis.probability_moderate * 100).toFixed(1)}%</span>
              </div>
              <Progress 
                value={diagnosis.probability_moderate * 100} 
                className="h-3 [&>div]:bg-warning"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium">Severe Risk</span>
                <span className="text-destructive">{(diagnosis.probability_severe * 100).toFixed(1)}%</span>
              </div>
              <Progress 
                value={diagnosis.probability_severe * 100} 
                className="h-3 [&>div]:bg-destructive"
              />
            </div>
          </div>
        </Card>

        {/* Key Factors */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Key Influencing Factors</h2>
          <ul className="space-y-2">
            {keyFactorsList.map((factor, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span className="text-muted-foreground">{factor}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Patient Info Summary */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
              <span className="text-muted-foreground block">Date</span>
              <span className="font-medium">
                {new Date(diagnosis.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <Button onClick={() => navigate("/diagnosis")} className="flex-1">
            New Diagnosis
          </Button>
          <Button onClick={() => navigate("/history")} variant="outline" className="flex-1">
            View History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;