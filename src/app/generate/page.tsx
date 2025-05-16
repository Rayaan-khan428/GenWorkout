'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

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

type WorkoutSplitOptions = {
  [key: number]: Array<{ value: string; label: string }>;
};

const WORKOUT_SPLITS: WorkoutSplitOptions = {
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
  sex: 'male' | 'female' | 'prefer_not_to_say';
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
    sex: 'prefer_not_to_say',
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
  const [currentStep, setCurrentStep] = useState(0);

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
    setCurrentStep(1); // Start loading animation at step 1

    if (formData.daysPerWeek < 1 || formData.daysPerWeek > 7) {
      setError('Please select between 1 and 7 days per week');
      setLoading(false);
      setCurrentStep(0);
      return;
    }

    // Format data according to schema
    const submissionData = {
      goals: formData.goals,
      experience: formData.experience,
      daysPerWeek: formData.daysPerWeek,
      workoutSplit: formData.workoutSplit,
      sex: formData.sex,
      preferences: {
        focusAreas: formData.preferences.focusAreas,
        sessionDuration: formData.preferences.sessionDuration,
        exercisesPerSession: formData.preferences.exercisesPerSession,
        excludedExercises: formData.preferences.excludedExercises,
      },
      hevyApiKey: formData.hevyApiKey,
    };

    try {
      // Set step 1: Generating workout
      setCurrentStep(1);
      
      // Simulate a delay for the first animation step
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      // Set step 2: Posting to Hevy
      setCurrentStep(2);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate workout plan');
      }

      // Simulate a delay for the second animation step
      await new Promise(resolve => setTimeout(resolve, 1500));

      const data = await response.json();
      
      // Set step 3: Success
      setCurrentStep(3);
      
      if (data.success) {
        console.log('Workout plan:', data.workoutPlan);
        // Show success state for 2 seconds before resetting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setCurrentStep(0);
    } finally {
      setLoading(false);
    }
  };

  // Animation steps content
  const loadingSteps = [
    { title: 'Ready', description: 'Fill the form and generate your workout' },
    { title: 'Creating Workout', description: 'Our AI is designing your perfect routine' },
    { title: 'Posting to Hevy', description: 'Syncing with your Hevy account' },
    { title: 'Complete!', description: 'Your workout has been created' },
  ];

  return (
    <main className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-3 inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium"
          >
            AI Workout Builder
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-4"
          >
            Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">Perfect Workout</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
          >
            Customize your workout parameters below and our AI will create a personalized plan tailored to your needs.
          </motion.p>
        </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BackgroundGradient className="w-full">
            <div className="p-8 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm">
              {/* Loading animation */}
              <AnimatePresence>
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-12"
                  >
                    <div className="bg-zinc-50/80 dark:bg-zinc-800/60 backdrop-blur-md rounded-2xl p-8 overflow-hidden border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl">
                      {/* Progress bar */}
                      <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full mb-8">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-500 dark:to-indigo-400 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: `${(currentStep / 3) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      
                      {/* Step indicators */}
                      <div className="flex justify-between mb-8">
                        {[1, 2, 3].map((step) => (
                          <div key={step} className="flex flex-col items-center">
                            <motion.div 
                              className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center",
                                currentStep >= step 
                                  ? "bg-gradient-to-br from-blue-600 to-indigo-500 dark:from-blue-500 dark:to-indigo-400 text-white shadow-lg" 
                                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700"
                              )}
                              initial={false}
                              animate={currentStep >= step ? 
                                { scale: [1, 1.2, 1], boxShadow: currentStep === step ? "0 0 0 0.25rem rgba(59, 130, 246, 0.25)" : "none" } : 
                                { scale: 1 }
                              }
        transition={{ duration: 0.5 }}
      >
                              {currentStep > step ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span className="text-lg font-medium">{step}</span>
                              )}
                            </motion.div>
                            <span className={cn(
                              "text-sm mt-2 font-medium",
                              currentStep >= step 
                                ? "text-blue-600 dark:text-blue-400" 
                                : "text-zinc-500 dark:text-zinc-500"
                            )}>
                              {step === 1 ? 'Creating' : step === 2 ? 'Syncing' : 'Done'}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Current step animation */}
                      <div className="text-center">
                        <motion.div
                          key={currentStep}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="mb-6"
                        >
                          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                            {loadingSteps[currentStep].title}
                          </h3>
                          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                            {loadingSteps[currentStep].description}
                          </p>
                        </motion.div>
                        
                        {/* Animation for current step */}
                        {currentStep === 1 && (
                          <motion.div 
                            animate={{ 
                              scale: [1, 1.05, 1],
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="flex justify-center py-6"
                          >
                            <div className="relative w-16 h-16">
                              <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900/30"></div>
                              <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
                              <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-indigo-500 dark:border-r-indigo-400 animate-spin animation-delay-500"></div>
                            </div>
                          </motion.div>
                        )}
                        
                        {currentStep === 2 && (
                          <motion.div
                            className="flex justify-center py-6"
                            initial={{ y: 0 }}
                            animate={{ 
                              y: [0, -10, 0],
                            }}
                            transition={{ 
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <div className="relative">
                              <svg className="w-16 h-16 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                              </svg>
                              <motion.div 
                                className="absolute -inset-4 rounded-full bg-blue-500/10 dark:bg-blue-400/10"
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 0.2, 0.5],
                                }}
                                transition={{ 
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            </div>
                          </motion.div>
                        )}
                        
                        {currentStep === 3 && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ 
                              scale: 1,
                              transition: { type: "spring", stiffness: 200, damping: 10 }
                            }}
                            className="flex justify-center py-6"
                          >
                            <div className="relative">
                              <svg className="w-20 h-20 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <motion.div 
                                className="absolute inset-0 rounded-full"
                                initial={{ scale: 0 }}
                                animate={{ 
                                  scale: [0, 1.5, 1],
                                  opacity: [1, 0, 0],
                                }}
                                transition={{ duration: 1 }}
                              >
                                <div className="w-full h-full rounded-full bg-green-500/20 dark:bg-green-400/20" />
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Column 1 */}
                  <div className="space-y-8">
              {/* Goals Input */}
                    <div className="space-y-3">
                <label 
                  htmlFor="goals" 
                        className="text-sm font-medium flex items-center text-zinc-700 dark:text-zinc-300"
                >
                        <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                  Workout Goals
                </label>
                <textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                        placeholder="Describe what you want to achieve with your workouts..."
                  className={cn(
                          "w-full rounded-xl border border-zinc-200 dark:border-zinc-800",
                          "bg-white dark:bg-zinc-900/80 px-4 py-3 text-sm",
                          "placeholder:text-zinc-400 dark:placeholder:text-zinc-600",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                          "disabled:cursor-not-allowed disabled:opacity-50",
                          "transition-colors duration-200"
                        )}
                        rows={4}
                  required
                />
              </div>

              {/* API Key */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center text-zinc-700 dark:text-zinc-300">
                        <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                  Hevy API Key
                </label>
                <Input
                  type="password"
                  value={formData.hevyApiKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, hevyApiKey: e.target.value }))}
                        className="rounded-xl h-12"
                  required
                />
                      <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        Your API key is used to securely connect with your Hevy account
                      </p>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-8">
                    {/* Sex Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center text-zinc-700 dark:text-zinc-300">
                        <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Sex
                      </label>
                      <div className="flex space-x-3">
                        {[
                          { value: 'male', label: 'Male' },
                          { value: 'female', label: 'Female' },
                          { value: 'prefer_not_to_say', label: 'Prefer not to say' }
                        ].map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              const sexValue = option.value as 'male' | 'female' | 'prefer_not_to_say';
                              setFormData(prev => ({ ...prev, sex: sexValue }));
                            }}
                            className={cn(
                              "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200",
                              formData.sex === option.value
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-2 border-blue-500/50 dark:border-blue-500/30"
                                : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-blue-500/20 dark:hover:border-blue-500/20"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
              </div>

              {/* Experience Level */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center text-zinc-700 dark:text-zinc-300">
                        <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                  Experience Level
                </label>
                      <div className="flex space-x-3">
                        {[
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                          { value: 'advanced', label: 'Advanced' }
                        ].map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              const expValue = option.value as 'beginner' | 'intermediate' | 'advanced';
                              setFormData(prev => ({ ...prev, experience: expValue }));
                            }}
                            className={cn(
                              "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200",
                              formData.experience === option.value
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-2 border-blue-500/50 dark:border-blue-500/30"
                                : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-blue-500/20 dark:hover:border-blue-500/20"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workout Configuration Section */}
                <div className="mt-10 mb-6">
                  <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-6">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      Workout Configuration
                    </h3>
              </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">
              {/* Days per Week */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center text-zinc-700 dark:text-zinc-300">
                          <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                  Days per Week
                </label>
                        <div className="flex space-x-3">
                          {[3, 4, 5, 6].map(days => (
                            <button
                              key={days}
                              type="button"
                              onClick={() => {
                                if (days in WORKOUT_SPLITS) {
                                  const options = WORKOUT_SPLITS[days];
                    setFormData(prev => ({
                      ...prev,
                      daysPerWeek: days,
                                    workoutSplit: options[0].value
                                  }));
                                }
                              }}
                              className={cn(
                                "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200",
                                formData.daysPerWeek === days
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-2 border-blue-500/50 dark:border-blue-500/30"
                                  : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-blue-500/20 dark:hover:border-blue-500/20"
                              )}
                            >
                              {days} Days
                            </button>
                          ))}
                        </div>
              </div>

              {/* Workout Split */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center text-zinc-700 dark:text-zinc-300">
                          <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                  Workout Split
                </label>
                        <div className="grid grid-cols-2 gap-3">
                          {formData.daysPerWeek in WORKOUT_SPLITS && 
                            WORKOUT_SPLITS[formData.daysPerWeek].map(split => (
                              <button
                                key={split.value}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, workoutSplit: split.value }))}
                                className={cn(
                                  "py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200",
                                  formData.workoutSplit === split.value
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-2 border-blue-500/50 dark:border-blue-500/30"
                                    : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-blue-500/20 dark:hover:border-blue-500/20"
                                )}
                              >
                                {split.label}
                              </button>
                            ))
                          }
                        </div>
                </div>
              </div>

                    {/* Right Column */}
                    <div className="space-y-8">
              {/* Session Duration */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center justify-between">
                          <span className="flex items-center text-zinc-700 dark:text-zinc-300">
                            <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Session Duration
                          </span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {formData.preferences.sessionDuration} min
                          </span>
                </label>
                        <div className="px-2">
                <Slider
                  value={[formData.preferences.sessionDuration]}
                  onValueChange={([value]) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, sessionDuration: value }
                  }))}
                  min={30}
                  max={120}
                  step={5}
                            className="py-4"
                />
                          <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                            <span>30 min</span>
                            <span>120 min</span>
                          </div>
                        </div>
              </div>

              {/* Exercises per Session */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center justify-between">
                          <span className="flex items-center text-zinc-700 dark:text-zinc-300">
                            <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Exercises per Session
                          </span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {formData.preferences.exercisesPerSession}
                          </span>
                </label>
                        <div className="px-2">
                <Slider
                  value={[formData.preferences.exercisesPerSession]}
                  onValueChange={([value]) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, exercisesPerSession: value }
                  }))}
                  min={4}
                  max={8}
                  step={1}
                            className="py-4"
                          />
                          <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                            <span>4 exercises</span>
                            <span>8 exercises</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target Muscle Groups */}
                <div className="mt-10 mb-6">
                  <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-6">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Target Muscle Groups
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {MUSCLE_GROUPS.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleMuscleGroupChange(value)}
                        className={cn(
                          "relative py-4 px-2 rounded-xl text-sm font-medium transition-all duration-200 flex flex-col items-center group",
                          formData.preferences.focusAreas.includes(value)
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-2 border-blue-500/50 dark:border-blue-500/30"
                            : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-blue-500/20 dark:hover:border-blue-500/20"
                        )}
                      >
                        {formData.preferences.focusAreas.includes(value) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-1 right-1 w-4 h-4 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center"
                          >
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}
                        <span 
                          className={cn(
                            "text-lg mb-1",
                            formData.preferences.focusAreas.includes(value)
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                          )}
                        >
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
                    Select one or more muscle groups to focus on
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-12">
              <button
                type="submit"
                disabled={loading}
                className={cn(
                      "w-full py-4 px-6 rounded-xl",
                      "bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600",
                      "text-white font-medium text-lg",
                      "transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-lg",
                  loading && "opacity-50 cursor-not-allowed"
                )}
              >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Generate Workout Plan
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                      </span>
                    )}
              </button>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-start"
                  >
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </motion.div>
              )}
            </form>
          </div>
        </BackgroundGradient>
      </motion.div>
      </div>
    </main>
  );
} 