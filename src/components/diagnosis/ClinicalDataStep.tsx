import { DiagnosisFormData } from "@/pages/Diagnosis";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type Props = {
  formData: DiagnosisFormData;
  updateFormData: (updates: Partial<DiagnosisFormData>) => void;
};

export const ClinicalDataStep = ({ formData, updateFormData }: Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Clinical Data</h2>
        <p className="text-muted-foreground">
          Enter your clinical test results and symptoms
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="chest_pain_type">Chest Pain Type</Label>
          <Select 
            value={formData.chest_pain_type} 
            onValueChange={(value) => updateFormData({ chest_pain_type: value })}
          >
            <SelectTrigger id="chest_pain_type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="typical_angina">Typical Angina</SelectItem>
              <SelectItem value="atypical_angina">Atypical Angina</SelectItem>
              <SelectItem value="non_anginal_pain">Non-Anginal Pain</SelectItem>
              <SelectItem value="asymptomatic">Asymptomatic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="resting_bp">Resting Blood Pressure (mm Hg)</Label>
          <Input
            id="resting_bp"
            type="number"
            min="80"
            max="200"
            value={formData.resting_bp}
            onChange={(e) => updateFormData({ resting_bp: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cholesterol">Serum Cholesterol (mg/dl)</Label>
          <Input
            id="cholesterol"
            type="number"
            min="100"
            max="600"
            value={formData.cholesterol}
            onChange={(e) => updateFormData({ cholesterol: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2 flex items-center justify-between p-4 border rounded-lg">
          <Label htmlFor="fasting_blood_sugar" className="cursor-pointer">
            Fasting Blood Sugar &gt; 120 mg/dl
          </Label>
          <Switch
            id="fasting_blood_sugar"
            checked={formData.fasting_blood_sugar}
            onCheckedChange={(checked) => updateFormData({ fasting_blood_sugar: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="resting_ecg">Resting ECG Results</Label>
          <Select 
            value={formData.resting_ecg} 
            onValueChange={(value) => updateFormData({ resting_ecg: value })}
          >
            <SelectTrigger id="resting_ecg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="st_t_abnormality">ST-T Wave Abnormality</SelectItem>
              <SelectItem value="left_ventricular_hypertrophy">Left Ventricular Hypertrophy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_heart_rate">Maximum Heart Rate (bpm)</Label>
          <Input
            id="max_heart_rate"
            type="number"
            min="60"
            max="220"
            value={formData.max_heart_rate}
            onChange={(e) => updateFormData({ max_heart_rate: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2 flex items-center justify-between p-4 border rounded-lg">
          <Label htmlFor="exercise_induced_angina" className="cursor-pointer">
            Exercise Induced Angina
          </Label>
          <Switch
            id="exercise_induced_angina"
            checked={formData.exercise_induced_angina}
            onCheckedChange={(checked) => updateFormData({ exercise_induced_angina: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="oldpeak">ST Depression (Oldpeak)</Label>
          <Input
            id="oldpeak"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={formData.oldpeak}
            onChange={(e) => updateFormData({ oldpeak: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="st_slope">ST Slope</Label>
          <Select 
            value={formData.st_slope} 
            onValueChange={(value) => updateFormData({ st_slope: value })}
          >
            <SelectTrigger id="st_slope">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upsloping">Upsloping</SelectItem>
              <SelectItem value="flat">Flat</SelectItem>
              <SelectItem value="downsloping">Downsloping</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="num_major_vessels">Number of Major Vessels (0-3)</Label>
          <Input
            id="num_major_vessels"
            type="number"
            min="0"
            max="3"
            value={formData.num_major_vessels}
            onChange={(e) => updateFormData({ num_major_vessels: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="thal">Thallium Stress Test</Label>
          <Select 
            value={formData.thal} 
            onValueChange={(value) => updateFormData({ thal: value })}
          >
            <SelectTrigger id="thal">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="fixed_defect">Fixed Defect</SelectItem>
              <SelectItem value="reversible_defect">Reversible Defect</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};