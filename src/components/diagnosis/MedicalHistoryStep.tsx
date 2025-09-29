import { DiagnosisFormData } from "@/pages/Diagnosis";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

type Props = {
  formData: DiagnosisFormData;
  updateFormData: (updates: Partial<DiagnosisFormData>) => void;
};

export const MedicalHistoryStep = ({ formData, updateFormData }: Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Medical History</h2>
        <p className="text-muted-foreground">
          Please indicate any relevant medical history
        </p>
      </div>

      <div className="space-y-4">
        <Card className="p-6 flex items-center justify-between">
          <div>
            <Label htmlFor="family_history" className="text-base font-medium cursor-pointer">
              Family History of Heart Disease
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Have any close relatives been diagnosed with heart disease?
            </p>
          </div>
          <Switch
            id="family_history"
            checked={formData.family_history}
            onCheckedChange={(checked) => updateFormData({ family_history: checked })}
          />
        </Card>

        <Card className="p-6 flex items-center justify-between">
          <div>
            <Label htmlFor="smoking" className="text-base font-medium cursor-pointer">
              Smoking
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Do you currently smoke or have a history of smoking?
            </p>
          </div>
          <Switch
            id="smoking"
            checked={formData.smoking}
            onCheckedChange={(checked) => updateFormData({ smoking: checked })}
          />
        </Card>

        <Card className="p-6 flex items-center justify-between">
          <div>
            <Label htmlFor="diabetes" className="text-base font-medium cursor-pointer">
              Diabetes
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Have you been diagnosed with diabetes (Type 1 or Type 2)?
            </p>
          </div>
          <Switch
            id="diabetes"
            checked={formData.diabetes}
            onCheckedChange={(checked) => updateFormData({ diabetes: checked })}
          />
        </Card>
      </div>

      <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Note:</strong> This information helps provide a more accurate risk assessment. 
          All data is confidential and will be used solely for diagnostic purposes.
        </p>
      </div>
    </div>
  );
};