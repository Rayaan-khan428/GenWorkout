// Moving from script.js to a proper TypeScript service
import { z } from "zod";
import { generateWorkoutWithAI } from './openai-service';
import { exerciseMappings } from './config/exercise-mappings';

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

export class HevyWorkoutCreator {
  private apiKey: string;
  private baseUrl: string;
  private exerciseTemplates: any[];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.hevy.com/v1';
    this.exerciseTemplates = [];
  }

  async fetchAllExerciseTemplates() {
    let page = 1;
    const pageSize = 100;
    let hasMorePages = true;
    
    while (hasMorePages) {
      try {
        const response = await fetch(
          `${this.baseUrl}/exercise_templates?page=${page}&pageSize=${pageSize}`,
          {
            headers: {
              'api-key': this.apiKey
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.exerciseTemplates.push(...data.exercise_templates);
        
        hasMorePages = page < data.page_count;
        page++;
      } catch (error) {
        console.error('Error fetching exercise templates:', error);
        break;
      }
    }
  }

  private validateExerciseTemplate(template: any) {
    if (!template || !template.id) {
      return false;
    }
    
    // Verify the template exists in our fetched templates
    return this.exerciseTemplates.some(t => t.id === template.id);
  }

  findExerciseTemplateIdWithAlternatives(exerciseName: string) {
    console.log(`Searching for exercise: ${exerciseName}`);
    
    // First try exact match
    const exactMatch = this.exerciseTemplates.find(t => 
      t.title.toLowerCase() === exerciseName.toLowerCase()
    );
    
    if (exactMatch && this.validateExerciseTemplate(exactMatch)) {
      console.log(`Found exact match: ${exactMatch.title}`);
      return {
        id: exactMatch.id,
        name: exactMatch.title,
        isAlternative: false
      };
    }

    // Check if we have a direct mapping
    if (exerciseMappings[exerciseName]) {
      const mappedExercise = this.exerciseTemplates.find(t => 
        t.title.toLowerCase() === exerciseMappings[exerciseName].toLowerCase()
      );
      if (mappedExercise && this.validateExerciseTemplate(mappedExercise)) {
        console.log(`Found mapped exercise: ${mappedExercise.title} for ${exerciseName}`);
        return {
          id: mappedExercise.id,
          name: mappedExercise.title,
          isAlternative: true
        };
      }
    }

    // If no mapping found, try flexible matching
    const searchTerms = exerciseName.toLowerCase()
      .replace(/\([^)]*\)/g, '')
      .split(/[\s-]+/)
      .filter(term => 
        !['with', 'using', 'on', 'the', 'a', 'an', 'machine', 'exercise'].includes(term)
      );

    console.log(`Searching with terms:`, searchTerms);

    const alternatives = this.exerciseTemplates
      .map(t => ({
        template: t,
        matchScore: searchTerms.filter(term => 
          t.title.toLowerCase().includes(term)
        ).length
      }))
      .filter(({ matchScore }) => matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    if (alternatives.length > 0) {
      const bestMatch = alternatives[0].template;
      console.log(`Found alternative: ${bestMatch.title} for ${exerciseName}`);
      
      return {
        id: bestMatch.id,
        name: bestMatch.title,
        isAlternative: true
      };
    }

    console.log(`No matches found for: ${exerciseName}`);
    return null;
  }

  async createRoutine(workout: WorkoutDay) {
    console.log(`Creating routine for ${workout.day} with exercises:`, workout.exercises);
    
    const processedExercises = workout.exercises.map((exercise) => {
      const template = this.findExerciseTemplateIdWithAlternatives(exercise.name);
      
      if (!template) {
        console.log(`No template found for: ${exercise.name}`);
        return null;
      }
      
      // Add logging for template IDs
      console.log(`Template found for ${exercise.name}:`, {
        id: template.id,
        name: template.name,
        isAlternative: template.isAlternative
      });

      const notes = template.isAlternative
        ? `${exercise.notes || ''} (Substituted with: ${template.name})`
        : exercise.notes || "Focus on form and control";

      return {
        exercise_template_id: template.id,
        superset_id: null,
        rest_seconds: exercise.isCompound ? 90 : 60,
        notes: notes,
        sets: Array(exercise.sets).fill().map(() => ({
          type: "normal",
          weight_kg: null,
          reps: exercise.reps,
          distance_meters: null,
          duration_seconds: null
        }))
      };
    }).filter(Boolean);

    // Log the processed exercises before sending to API
    console.log('Processed exercises:', JSON.stringify(processedExercises, null, 2));

    if (processedExercises.length === 0) {
      throw new Error(`No valid exercises found for ${workout.day}`);
    }

    try {
      const routine = {
        title: `${workout.muscle_groups} - ${workout.day}`,
        folder_id: null,
        notes: "Generated workout routine",
        exercises: processedExercises
      };

      // Log the full request body
      console.log('Request body:', JSON.stringify({ routine }, null, 2));

      const response = await fetch(`${this.baseUrl}/routines`, {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ routine })
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('API Error Response:', text);
        try {
          const errorData = JSON.parse(text);
          throw new Error(`API Error: ${JSON.stringify(errorData)}`);
        } catch {
          throw new Error(`API Error: ${text}`);
        }
      }

      return response.json();
    } catch (error) {
      console.error('Error creating routine:', error);
      throw error;
    }
  }

  async generateWorkoutPlan(plan: WorkoutPlan) {
    await this.fetchAllExerciseTemplates();
    
    if (this.exerciseTemplates.length === 0) {
      throw new Error("No exercise templates were fetched. Check your API key and connection.");
    }

    // Generate workout based on user preferences
    const workoutPlan = await this.generatePlanBasedOnPreferences(plan);
    
    // Create routines for each workout
    const routines = [];
    for (const workout of workoutPlan.workouts) {
      const routine = await this.createRoutine(workout);
      routines.push(routine);
    }

    return routines;
  }

  private async generatePlanBasedOnPreferences(plan: WorkoutPlan) {
    // Remove fallback since we want to know if AI generation fails
    return await generateWorkoutWithAI(plan);
  }
} 