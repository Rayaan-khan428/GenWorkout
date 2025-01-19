import { z } from "zod";

export const workoutSchema = z.object({
  goals: z.string(),
  experience: z.enum(["beginner", "intermediate", "advanced"]),
  daysPerWeek: z.number().min(1).max(7),
  workoutSplit: z.string(),
  preferences: z.object({
    focusAreas: z.array(z.string()),
    excludedExercises: z.array(z.string()).optional(),
    sessionDuration: z.number().min(30).max(120),
    exercisesPerSession: z.number().min(4).max(8),
  }),
  hevyApiKey: z.string(),
});

export type WorkoutPlan = z.infer<typeof workoutSchema>;

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  isCompound: boolean;
  notes?: string;
}

export interface WorkoutDay {
  day: string;
  muscle_groups: string;
  exercises: Exercise[];
}

export interface WorkoutPlanResponse {
  workouts: WorkoutDay[];
} 