import OpenAI from "openai";
import { WorkoutPlan } from './hevy-workout-creator';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  isCompound: boolean;
  notes?: string;
}

interface WorkoutDay {
  day: string;
  muscle_groups: string;
  exercises: Exercise[];
}

interface WorkoutPlanResponse {
  workouts: WorkoutDay[];
}

export async function generateWorkoutWithAI(plan: WorkoutPlan): Promise<WorkoutPlanResponse> {
  const userPrompt = `
    Create a workout plan with these specifications:
    - Days per week: ${plan.daysPerWeek}
    - Experience level: ${plan.experience}
    - Goals: ${plan.goals}
    - Focus areas: ${plan.preferences.focusAreas.join(', ')}
    - Session duration: ${plan.preferences.sessionDuration} minutes
    - Exercises per session: ${plan.preferences.exercisesPerSession}
    - Workout split: ${plan.workoutSplit}
    ${plan.preferences.excludedExercises?.length ? `- Excluded exercises: ${plan.preferences.excludedExercises.join(', ')}` : ''}

    Sets per exercise based on experience:
    ${plan.experience === 'beginner' ? '3' : plan.experience === 'intermediate' ? '4' : '5'} sets per exercise

    IMPORTANT: Respond ONLY with a JSON object in this exact format:
    {
      "workouts": [
        {
          "day": "Monday",
          "muscle_groups": "Chest and Triceps",
          "exercises": [
            {
              "name": "Bench Press",
              "sets": 3,
              "reps": 8,
              "isCompound": true,
              "notes": "Keep shoulders retracted, feet planted firmly"
            }
          ]
        }
      ]
    }
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a professional fitness coach. You MUST respond with ONLY a valid JSON object matching the specified schema. No markdown, no explanations, no additional text."
      },
      {
        role: "user",
        content: userPrompt
      }
    ]
  });

  if (!completion.choices[0].message.content) {
    throw new Error("Failed to generate workout plan");
  }

  try {
    const content = completion.choices[0].message.content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const workoutPlan = JSON.parse(content) as WorkoutPlanResponse;
    
    // Validate that reps are single numbers
    workoutPlan.workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        if (Array.isArray(exercise.reps)) {
          exercise.reps = Math.round((exercise.reps[0] + exercise.reps[1]) / 2);
        }
      });
    });

    return workoutPlan;
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    console.error('Raw response:', completion.choices[0].message.content);
    throw new Error("Failed to parse workout plan");
  }
} 