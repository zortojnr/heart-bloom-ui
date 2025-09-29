import { DiagnosisFormData } from "@/pages/Diagnosis";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  formData: DiagnosisFormData;
  updateFormData: (updates: Partial<DiagnosisFormData>) => void;
};

export const PersonalInfoStep = ({ formData, updateFormData }: Props) => {
  const calculateBMI = (height: number, weight: number) => {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const handleHeightChange = (value: string) => {
    const height = Number(value);
    const bmi = calculateBMI(height, formData.weight);
    updateFormData({ height, bmi });
  };

  const handleWeightChange = (value: string) => {
    const weight = Number(value);
    const bmi = calculateBMI(formData.height, weight);
    updateFormData({ weight, bmi });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Personal Information</h2>
        <p className="text-muted-foreground">
          Please provide your basic demographic information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="age">Age (years)</Label>
          <Input
            id="age"
            type="number"
            min="1"
            max="120"
            value={formData.age}
            onChange={(e) => updateFormData({ age: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sex">Sex</Label>
          <Select value={formData.sex} onValueChange={(value) => updateFormData({ sex: value })}>
            <SelectTrigger id="sex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            min="100"
            max="250"
            value={formData.height}
            onChange={(e) => handleHeightChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            min="30"
            max="300"
            value={formData.weight}
            onChange={(e) => handleWeightChange(e.target.value)}
          />
        </div>

        <div className="md:col-span-2 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <Label className="text-sm font-medium">Body Mass Index (BMI)</Label>
          <p className="text-3xl font-bold text-accent mt-1">{formData.bmi}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {formData.bmi < 18.5 && "Underweight"}
            {formData.bmi >= 18.5 && formData.bmi < 25 && "Normal weight"}
            {formData.bmi >= 25 && formData.bmi < 30 && "Overweight"}
            {formData.bmi >= 30 && "Obese"}
          </p>
        </div>
      </div>
    </div>
  );
};