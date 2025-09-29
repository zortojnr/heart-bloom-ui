-- Create diagnoses table for storing patient diagnosis records
CREATE TABLE public.diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Patient demographic info
  age INTEGER NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('male', 'female')),
  height DECIMAL NOT NULL,
  weight DECIMAL NOT NULL,
  bmi DECIMAL NOT NULL,
  
  -- Clinical inputs
  chest_pain_type TEXT NOT NULL CHECK (chest_pain_type IN ('typical_angina', 'atypical_angina', 'non_anginal_pain', 'asymptomatic')),
  resting_bp INTEGER NOT NULL,
  cholesterol INTEGER NOT NULL,
  fasting_blood_sugar BOOLEAN NOT NULL,
  resting_ecg TEXT NOT NULL CHECK (resting_ecg IN ('normal', 'st_t_abnormality', 'left_ventricular_hypertrophy')),
  max_heart_rate INTEGER NOT NULL,
  exercise_induced_angina BOOLEAN NOT NULL,
  oldpeak DECIMAL NOT NULL,
  st_slope TEXT NOT NULL CHECK (st_slope IN ('upsloping', 'flat', 'downsloping')),
  num_major_vessels INTEGER CHECK (num_major_vessels >= 0 AND num_major_vessels <= 3),
  thal TEXT NOT NULL CHECK (thal IN ('normal', 'fixed_defect', 'reversible_defect')),
  family_history BOOLEAN NOT NULL,
  smoking BOOLEAN NOT NULL,
  diabetes BOOLEAN NOT NULL,
  
  -- AI diagnosis results
  risk_level TEXT NOT NULL CHECK (risk_level IN ('healthy', 'moderate', 'severe')),
  probability_healthy DECIMAL NOT NULL,
  probability_moderate DECIMAL NOT NULL,
  probability_severe DECIMAL NOT NULL,
  key_factors TEXT NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own diagnoses
CREATE POLICY "Users can view their own diagnoses"
ON public.diagnoses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagnoses"
ON public.diagnoses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diagnoses"
ON public.diagnoses
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagnoses"
ON public.diagnoses
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_diagnoses_updated_at
BEFORE UPDATE ON public.diagnoses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_diagnoses_user_id ON public.diagnoses(user_id);
CREATE INDEX idx_diagnoses_created_at ON public.diagnoses(created_at DESC);