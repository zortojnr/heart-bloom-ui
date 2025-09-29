import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const patientData = await req.json();
    
    console.log("Processing diagnosis for user:", user.id);

    // Construct medical prompt for AI
    const prompt = `You are a medical diagnostic assistant analyzing heart disease risk factors. 

Patient Profile:
- Age: ${patientData.age} years
- Sex: ${patientData.sex}
- BMI: ${patientData.bmi}

Clinical Data:
- Chest Pain Type: ${patientData.chest_pain_type}
- Resting Blood Pressure: ${patientData.resting_bp} mm Hg
- Cholesterol: ${patientData.cholesterol} mg/dl
- Fasting Blood Sugar: ${patientData.fasting_blood_sugar ? ">120 mg/dl" : "≤120 mg/dl"}
- Resting ECG: ${patientData.resting_ecg}
- Maximum Heart Rate: ${patientData.max_heart_rate} bpm
- Exercise Induced Angina: ${patientData.exercise_induced_angina ? "Yes" : "No"}
- ST Depression (Oldpeak): ${patientData.oldpeak}
- ST Slope: ${patientData.st_slope}
- Number of Major Vessels (0-3): ${patientData.num_major_vessels}
- Thallium Stress Test: ${patientData.thal}

Medical History:
- Family History of Heart Disease: ${patientData.family_history ? "Yes" : "No"}
- Smoking: ${patientData.smoking ? "Yes" : "No"}
- Diabetes: ${patientData.diabetes ? "Yes" : "No"}

Based on these factors, classify the patient's heart disease risk and provide probabilities.`;

    // Call Lovable AI with structured output
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a medical diagnostic AI. Analyze patient data and provide heart disease risk assessment."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "diagnose_heart_disease",
              description: "Provide heart disease risk assessment with probabilities",
              parameters: {
                type: "object",
                properties: {
                  risk_level: {
                    type: "string",
                    enum: ["healthy", "moderate", "severe"],
                    description: "Overall risk classification"
                  },
                  probability_healthy: {
                    type: "number",
                    description: "Probability of healthy status (0-1)"
                  },
                  probability_moderate: {
                    type: "number",
                    description: "Probability of moderate risk (0-1)"
                  },
                  probability_severe: {
                    type: "number",
                    description: "Probability of severe risk (0-1)"
                  },
                  key_factors: {
                    type: "array",
                    items: { type: "string" },
                    description: "Top 3-5 factors influencing the diagnosis"
                  }
                },
                required: ["risk_level", "probability_healthy", "probability_moderate", "probability_severe", "key_factors"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "diagnose_heart_disease" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    console.log("AI Response:", JSON.stringify(aiResult));

    const toolCall = aiResult.choices[0].message.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const diagnosis = JSON.parse(toolCall.function.arguments);
    
    // Store diagnosis in database
    const { data: savedDiagnosis, error: dbError } = await supabase
      .from("diagnoses")
      .insert({
        user_id: user.id,
        age: patientData.age,
        sex: patientData.sex,
        height: patientData.height,
        weight: patientData.weight,
        bmi: patientData.bmi,
        chest_pain_type: patientData.chest_pain_type,
        resting_bp: patientData.resting_bp,
        cholesterol: patientData.cholesterol,
        fasting_blood_sugar: patientData.fasting_blood_sugar,
        resting_ecg: patientData.resting_ecg,
        max_heart_rate: patientData.max_heart_rate,
        exercise_induced_angina: patientData.exercise_induced_angina,
        oldpeak: patientData.oldpeak,
        st_slope: patientData.st_slope,
        num_major_vessels: patientData.num_major_vessels,
        thal: patientData.thal,
        family_history: patientData.family_history,
        smoking: patientData.smoking,
        diabetes: patientData.diabetes,
        risk_level: diagnosis.risk_level,
        probability_healthy: diagnosis.probability_healthy,
        probability_moderate: diagnosis.probability_moderate,
        probability_severe: diagnosis.probability_severe,
        key_factors: diagnosis.key_factors.join("; "),
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Failed to save diagnosis: ${dbError.message}`);
    }

    console.log("Diagnosis saved successfully:", savedDiagnosis.id);

    return new Response(
      JSON.stringify({
        ...diagnosis,
        diagnosis_id: savedDiagnosis.id
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Diagnosis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});