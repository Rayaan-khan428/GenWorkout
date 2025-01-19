'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const MUSCLE_GROUPS = [
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'legs', label: 'Legs' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'biceps', label: 'Biceps' },
  { value: 'triceps', label: 'Triceps' },
  { value: 'abs', label: 'Abs' },
  { value: 'calves', label: 'Calves' },
] as const;

const WORKOUT_SPLITS = {
  3: [
    { value: 'fullbody', label: 'Full Body' },
    { value: 'ppl', label: 'Push/Pull/Legs' },
  ],
  4: [
    { value: 'upper_lower', label: 'Upper/Lower' },
    { value: 'arnold', label: 'Arnold Split' },
  ],
  5: [
    { value: 'bro', label: 'Bro Split' },
    { value: 'ppl_upper_lower', label: 'PPL + Upper/Lower' },
  ],
  6: [
    { value: 'ppl_2x', label: 'PPL 2x/week' },
    { value: 'arnold_2x', label: 'Arnold Split 2x/week' },
  ],
} as const;

interface FormData {
  goals: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  workoutSplit: string;
  preferences: {
    focusAreas: string[];
    excludedExercises: string[];
    sessionDuration: number;
    exercisesPerSession: number;
  };
  hevyApiKey: string;
}

export default function GeneratePage() {
  const [formData, setFormData] = useState<FormData>({
    goals: '',
    experience: 'beginner',
    daysPerWeek: 5,
    workoutSplit: 'bro',
    preferences: {
      focusAreas: [],
      excludedExercises: [],
      sessionDuration: 60,
      exercisesPerSession: 6,
    },
    hevyApiKey: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMuscleGroupChange = (muscleGroup: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        focusAreas: prev.preferences.focusAreas.includes(muscleGroup)
          ? prev.preferences.focusAreas.filter(m => m !== muscleGroup)
          : [...prev.preferences.focusAreas, muscleGroup]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.daysPerWeek < 1 || formData.daysPerWeek > 7) {
      setError('Please select between 1 and 7 days per week');
      setLoading(false);
      return;
    }

    // Format data according to schema
    const submissionData = {
      goals: formData.goals,
      experience: formData.experience,
      daysPerWeek: formData.daysPerWeek,
      workoutSplit: formData.workoutSplit,
      preferences: {
        focusAreas: formData.preferences.focusAreas,
        sessionDuration: formData.preferences.sessionDuration,
        exercisesPerSession: formData.preferences.exercisesPerSession,
        excludedExercises: formData.preferences.excludedExercises,
      },
      hevyApiKey: formData.hevyApiKey,
    };

    try {
      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate workout plan');
      }

      const data = await response.json();
      if (data.success) {
        console.log('Workout plan:', data.workoutPlan);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackgroundGradient className="w-full">
          <div className="p-8 rounded-[22px] bg-zinc-900">
            <h1 className="text-3xl font-bold text-white mb-2">
              Generate Your Workout Plan
            </h1>
            <p className="text-zinc-400 mb-8">
              Customize your workout plan preferences
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Goals Input */}
              <div className="space-y-2">
                <label 
                  htmlFor="goals" 
                  className="text-sm font-medium text-zinc-200"
                >
                  Workout Goals
                </label>
                <textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                  placeholder="Describe your fitness goals (e.g., build muscle, lose weight, improve strength)"
                  className={cn(
                    "w-full rounded-md border border-zinc-800",
                    "bg-zinc-900/50 px-3 py-2 text-sm",
                    "placeholder:text-zinc-400",
                    "focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-zinc-900",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  rows={3}
                  required
                />
              </div>

              {/* API Key */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-200">
                  Hevy API Key
                </label>
                <Input
                  type="password"
                  value={formData.hevyApiKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, hevyApiKey: e.target.value }))}
                  required
                />
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-200">
                  Experience Level
                </label>
                <Select
                  value={formData.experience}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
                  options={[
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                  ]}
                />
              </div>

              {/* Days per Week */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-200">
                  Days per Week
                </label>
                <Select
                  value={formData.daysPerWeek.toString()}
                  onValueChange={(value) => {
                    const days = parseInt(value);
                    setFormData(prev => ({
                      ...prev,
                      daysPerWeek: days,
                      workoutSplit: WORKOUT_SPLITS[days][0].value
                    }));
                  }}
                  options={[3,4,5,6].map(n => ({ value: n.toString(), label: `${n} days` }))}
                />
              </div>

              {/* Workout Split */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-200">
                  Workout Split
                </label>
                <Select
                  value={formData.workoutSplit}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, workoutSplit: value }))}
                  options={WORKOUT_SPLITS[formData.daysPerWeek]}
                />
              </div>

              {/* Target Muscle Groups */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-200">
                  Target Muscle Groups
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MUSCLE_GROUPS.map(({ value, label }) => (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={value}
                        checked={formData.preferences.focusAreas.includes(value)}
                        onCheckedChange={() => handleMuscleGroupChange(value)}
                      />
                      <label htmlFor={value} className="text-sm text-zinc-200">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Duration */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-zinc-200">
                  Session Duration: {formData.preferences.sessionDuration} minutes
                </label>
                <Slider
                  value={[formData.preferences.sessionDuration]}
                  onValueChange={([value]) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, sessionDuration: value }
                  }))}
                  min={30}
                  max={120}
                  step={5}
                />
              </div>

              {/* Exercises per Session */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-zinc-200">
                  Exercises per Session: {formData.preferences.exercisesPerSession}
                </label>
                <Slider
                  value={[formData.preferences.exercisesPerSession]}
                  onValueChange={([value]) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, exercisesPerSession: value }
                  }))}
                  min={4}
                  max={8}
                  step={1}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full py-3 px-4 rounded-md",
                  "bg-blue-600 hover:bg-blue-700",
                  "text-white font-medium",
                  "transition-all duration-200",
                  loading && "opacity-50 cursor-not-allowed"
                )}
              >
                {loading ? "Generating..." : "Generate Workout Plan"}
              </button>

              {error && (
                <div className="text-red-400 text-sm animate-shake">
                  {error}
                </div>
              )}
            </form>
          </div>
        </BackgroundGradient>
      </motion.div>
    </main>
  );
} 