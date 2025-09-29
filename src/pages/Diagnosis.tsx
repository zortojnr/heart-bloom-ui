import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ArrowRight, Activity } from "lucide-react";
import { PersonalInfoStep } from "@/components/diagnosis/PersonalInfoStep";
import { ClinicalDataStep } from "@/components/diagnosis/ClinicalDataStep";
import { MedicalHistoryStep } from "@/components/diagnosis/MedicalHistoryStep";
import { ReviewStep } from "@/components/diagnosis/ReviewStep";

export type DiagnosisFormData = {
  // Personal Info
  age: number;
  sex: string;
  height: number;
  weight: number;
  bmi: number;
  
  // Clinical Data
  chest_pain_type: string;
  resting_bp: number;
  cholesterol: number;
  fasting_blood_sugar: boolean;
  resting_ecg: string;
  max_heart_rate: number;
  exercise_induced_angina: boolean;
  oldpeak: number;
  st_slope: string;
  num_major_vessels: number;
  thal: string;
  
  // Medical History
  family_history: boolean;
  smoking: boolean;
  diabetes: boolean;
};

const TOTAL_STEPS = 4;

const Diagnosis = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<DiagnosisFormData>({
    age: 50,
    sex: "male",
    height: 170,
    weight: 70,
    bmi: 24.2,
    chest_pain_type: "typical_angina",
    resting_bp: 120,
    cholesterol: 200,
    fasting_blood_sugar: false,
    resting_ecg: "normal",
    max_heart_rate: 150,
    exercise_induced_angina: false,
    oldpeak: 0,
    st_slope: "upsloping",
    num_major_vessels: 0,
    thal: "normal",
    family_history: false,
    smoking: false,
    diabetes: false,
  });

  const updateFormData = (updates: Partial<DiagnosisFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please log in to continue");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke("diagnose", {
        body: formData
      });

      if (error) {
        console.error("Diagnosis error:", error);
        toast.error(error.message || "Failed to process diagnosis");
        return;
      }

      toast.success("Diagnosis completed successfully!");
      navigate(`/results/${data.diagnosis_id}`);
      
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Heart Disease Risk Assessment
            </h1>
          </div>
          <p className="text-muted-foreground">
            Step {currentStep} of {TOTAL_STEPS}
          </p>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="mb-8" />

        {/* Form Steps */}
        <Card className="p-6 md:p-8">
          {currentStep === 1 && (
            <PersonalInfoStep formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 2 && (
            <ClinicalDataStep formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 3 && (
            <MedicalHistoryStep formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 4 && (
            <ReviewStep formData={formData} />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Submit Diagnosis"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Diagnosis;