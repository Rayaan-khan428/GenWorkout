import { NextResponse } from 'next/server';
import { HevyWorkoutCreator, workoutSchema } from '@/lib/hevy-workout-creator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = workoutSchema.parse(body);
    
    // Create workout plan
    const creator = new HevyWorkoutCreator(validatedData.hevyApiKey);
    const workoutPlan = await creator.generateWorkoutPlan(validatedData);

    return NextResponse.json({ 
      success: true, 
      workoutPlan 
    });

  } catch (error) {
    console.error('Error generating workout:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate workout plan' 
      },
      { status: 400 }
    );
  }
} 