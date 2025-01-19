"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BackgroundGradient } from "@/components/ui/background-gradient";

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

export default function Home() {
  return (
    <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Hero Section */}
      <motion.div 
        initial="initial"
        animate="animate"
        variants={stagger}
        className="text-center mb-16"
      >
        <motion.h1 
          variants={fadeIn}
          className="text-4xl sm:text-6xl font-bold text-zinc-900 dark:text-white mb-6"
        >
          AI-Powered Workout Planning
          <span className="text-blue-600 dark:text-blue-400 inline-block ml-2">
            with Hevy
          </span>
        </motion.h1>
        
        <motion.p 
          variants={fadeIn}
          className="text-xl text-zinc-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          Create personalized workout plans using AI and seamlessly sync them with your Hevy account
        </motion.p>

        <motion.div 
          variants={fadeIn}
          className="mt-8 flex gap-4 justify-center"
        >
          <Link
            href="/generate"
            className={cn(
              "rounded-full bg-blue-600 px-8 py-3 text-white",
              "hover:bg-blue-700 hover:scale-105 transform",
              "transition-all duration-200 ease-out",
              "shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
            )}
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className={cn(
              "rounded-full border border-zinc-200 dark:border-zinc-700 px-8 py-3",
              "text-zinc-700 dark:text-gray-300",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white",
              "hover:scale-105 transform",
              "transition-all duration-200 ease-out",
              "shadow-lg hover:shadow-xl"
            )}
          >
            Learn More
          </Link>
        </motion.div>
      </motion.div>

      {/* How It Works Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-zinc-900 dark:text-white">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((num, idx) => (
            <BackgroundGradient
              key={num}
              className="h-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "text-center p-8 rounded-[22px]",
                  "bg-white/80 dark:bg-zinc-900",
                  "shadow-lg hover:shadow-xl hover:shadow-blue-500/10",
                  "transition-all duration-200"
                )}
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-blue-600 dark:text-blue-400">{num}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
                  {num === 1 && "Connect Your Hevy Account"}
                  {num === 2 && "Describe Your Goals"}
                  {num === 3 && "Generate & Sync"}
                </h3>
                <p className="text-zinc-600 dark:text-gray-400">
                  {num === 1 && "Link your Hevy account using your API key to enable seamless workout syncing"}
                  {num === 2 && "Tell our AI about your fitness goals, experience level, and preferences"}
                  {num === 3 && "Get AI-generated workout plans and sync them directly to your Hevy account"}
                </p>
              </motion.div>
            </BackgroundGradient>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-zinc-900 dark:text-white">
          Features
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {["AI-Powered Planning", "Hevy Integration"].map((feature, idx) => (
            <BackgroundGradient
              key={feature}
              className="h-full"
            >
              <motion.div
                initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "p-8 rounded-[22px]",
                  "bg-white/80 dark:bg-zinc-900",
                  "shadow-lg hover:shadow-xl hover:shadow-blue-500/10",
                  "transition-all duration-200"
                )}
              >
                <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">{feature}</h3>
                <p className="text-zinc-600 dark:text-gray-400">
                  {feature === "AI-Powered Planning"
                    ? "Leverage ChatGPT to create personalized workout plans based on your specific needs"
                    : "Direct integration with Hevy for seamless workout tracking and progress monitoring"}
                </p>
              </motion.div>
            </BackgroundGradient>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
