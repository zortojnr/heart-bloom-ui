import { DiagnosisFormData } from "@/pages/Diagnosis";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

type Props = {
  formData: DiagnosisFormData;
};

export const ReviewStep = ({ formData }: Props) => {
  const BooleanIndicator = ({ value }: { value: boolean }) => (
    value ? (
      <CheckCircle2 className="h-4 w-4 text-success inline" />
    ) : (
      <XCircle className="h-4 w-4 text-muted-foreground inline" />
    )
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Review Your Information</h2>
        <p className="text-muted-foreground">
          Please review all the information before submitting
        </p>
      </div>

      <div className="space-y-4">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Age:</span>
              <span className="ml-2 font-medium">{formData.age} years</span>
            </div>
            <div>
              <span className="text-muted-foreground">Sex:</span>
              <span className="ml-2 font-medium capitalize">{formData.sex}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Height:</span>
              <span className="ml-2 font-medium">{formData.height} cm</span>
            </div>
            <div>
              <span className="text-muted-foreground">Weight:</span>
              <span className="ml-2 font-medium">{formData.weight} kg</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">BMI:</span>
              <span className="ml-2 font-medium text-accent">{formData.bmi}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary">Clinical Data</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="col-span-2">
              <span className="text-muted-foreground">Chest Pain:</span>
              <span className="ml-2 font-medium capitalize">{formData.chest_pain_type.replace(/_/g, " ")}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Resting BP:</span>
              <span className="ml-2 font-medium">{formData.resting_bp} mm Hg</span>
            </div>
            <div>
              <span className="text-muted-foreground">Cholesterol:</span>
              <span className="ml-2 font-medium">{formData.cholesterol} mg/dl</span>
            </div>
            <div>
              <span className="text-muted-foreground">Fasting Blood Sugar &gt;120:</span>
              <span className="ml-2"><BooleanIndicator value={formData.fasting_blood_sugar} /></span>
            </div>
            <div>
              <span className="text-muted-foreground">Max Heart Rate:</span>
              <span className="ml-2 font-medium">{formData.max_heart_rate} bpm</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Resting ECG:</span>
              <span className="ml-2 font-medium capitalize">{formData.resting_ecg.replace(/_/g, " ")}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Exercise Angina:</span>
              <span className="ml-2"><BooleanIndicator value={formData.exercise_induced_angina} /></span>
            </div>
            <div>
              <span className="text-muted-foreground">ST Depression:</span>
              <span className="ml-2 font-medium">{formData.oldpeak}</span>
            </div>
            <div>
              <span className="text-muted-foreground">ST Slope:</span>
              <span className="ml-2 font-medium capitalize">{formData.st_slope}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Major Vessels:</span>
              <span className="ml-2 font-medium">{formData.num_major_vessels}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Thallium Test:</span>
              <span className="ml-2 font-medium capitalize">{formData.thal.replace(/_/g, " ")}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-primary">Medical History</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Family History of Heart Disease</span>
              <BooleanIndicator value={formData.family_history} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Smoking</span>
              <BooleanIndicator value={formData.smoking} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Diabetes</span>
              <BooleanIndicator value={formData.diabetes} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};