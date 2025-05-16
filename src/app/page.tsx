"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BackgroundGradient } from "@/components/ui/background-gradient";

// SVG illustrations for the workout theme
const WorkoutIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <motion.circle 
      cx="100" 
      cy="100" 
      r="50" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="text-blue-500 dark:text-blue-400"
    />
    <motion.path
      d="M70,100 L130,100"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="text-blue-600 dark:text-blue-500"
    />
    <motion.circle 
      cx="60" 
      cy="100" 
      r="10" 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fill-blue-700 dark:fill-blue-600"
    />
    <motion.circle 
      cx="140" 
      cy="100" 
      r="10" 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      className="fill-blue-700 dark:fill-blue-600"
    />
  </svg>
);

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const FloatingDots = ({ count = 15 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-blue-400/20 dark:bg-blue-500/20"
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.3,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
          }}
          transition={{ 
            duration: Math.random() * 20 + 10, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  return (
    <main className="relative">
      <FloatingDots count={20} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="initial"
              animate="animate"
              variants={stagger}
              className="text-left"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-4 inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium"
              >
                AI-Powered Fitness
              </motion.div>
              
              <motion.h1 
                variants={fadeIn}
                className="text-5xl sm:text-6xl font-bold text-zinc-900 dark:text-white leading-tight mb-6"
              >
                Transform Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
                  Workout Routine
                </span>
              </motion.h1>
              
              <motion.p 
                variants={fadeIn}
                className="text-xl text-zinc-600 dark:text-gray-300 max-w-xl mb-8"
              >
                Generate personalized workout plans tailored to your goals and preferences, and seamlessly sync them with Hevy for progress tracking.
              </motion.p>

              <motion.div 
                variants={fadeIn}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/generate"
                  className={cn(
                    "rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-8 py-4 text-white font-medium",
                    "hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1",
                    "transition-all duration-200 ease-out text-center"
                  )}
                >
                  Get Started
                </Link>
                <Link
                  href="/about"
                  className={cn(
                    "rounded-full border border-zinc-200 dark:border-zinc-700 px-8 py-4",
                    "text-zinc-700 dark:text-gray-300 font-medium",
                    "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white",
                    "transform hover:-translate-y-1",
                    "transition-all duration-200 ease-out text-center"
                  )}
                >
                  Learn More
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-12 flex items-center gap-2 text-zinc-500 dark:text-zinc-400"
              >
                <span className="flex -space-x-2">
                  {[1, 2, 3].map(n => (
                    <div key={n} className={`w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-blue-${n*100} dark:bg-blue-${n*100+200}`}></div>
                  ))}
                </span>
                <span>Join <span className="font-medium text-zinc-800 dark:text-white">2,500+</span> users building better workouts</span>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[450px] flex items-center justify-center"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  animate={{ 
                    rotate: 360,
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="w-[350px] h-[350px] rounded-full border border-blue-100 dark:border-blue-900/30"
                />
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ 
                    duration: 30, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="w-[280px] h-[280px] rounded-full border border-indigo-100 dark:border-indigo-900/30"
                />
              </div>

              <BackgroundGradient className="w-[300px] h-[300px] rounded-full overflow-hidden">
                <div className="w-full h-full rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-8">
                  <div className="w-full h-full relative">
                    <WorkoutIllustration />
                  </div>
                </div>
              </BackgroundGradient>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-zinc-900 dark:text-white inline-block pb-2 border-b-2 border-blue-500 dark:border-blue-400"
            >
              Smarter Workouts Made Simple
            </motion.h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "AI-Powered Design",
                description: "Intelligent workout creation tailored to your body and goals, including sex-specific optimization",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )
              },
              {
                title: "Seamless Hevy Sync",
                description: "Direct integration with your Hevy account for effortless tracking and progression",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                )
              },
              {
                title: "Personalized Experience",
                description: "Tailor workouts to your schedule, equipment access, and fitness level",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )
              }
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
                className="relative"
              >
                <BackgroundGradient className="h-full">
                  <div className="h-full p-8 rounded-2xl bg-white dark:bg-zinc-900 flex flex-col">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl w-16 h-16 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 flex-grow">
                      {feature.description}
                    </p>
                  </div>
                </BackgroundGradient>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackgroundGradient className="w-full">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center p-12 rounded-3xl bg-zinc-900 relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" fill="none">
                  <defs>
                    <pattern
                      id="grid-pattern"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                </svg>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to optimize your workouts?
                </h2>
                <p className="text-xl text-zinc-300 max-w-2xl mx-auto mb-10">
                  Create AI-powered fitness plans tailored to your body and goals, with just a few clicks.
                </p>
                <Link
                  href="/generate"
                  className={cn(
                    "inline-block rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-8 py-4 text-white font-medium",
                    "hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1",
                    "transition-all duration-200 ease-out"
                  )}
                >
                  Get Started Now
                </Link>
              </div>
            </motion.div>
          </BackgroundGradient>
        </div>
      </section>
    </main>
  );
}
