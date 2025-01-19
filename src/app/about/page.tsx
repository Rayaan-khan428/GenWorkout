"use client";

import { motion } from "framer-motion";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import Link from "next/link";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "AI-Powered Workout Generation",
    description: "Utilizes advanced AI to create personalized workout plans based on your goals, experience, and preferences."
  },
  {
    title: "Hevy Integration",
    description: "Seamlessly syncs generated workouts with your Hevy account for easy tracking and progress monitoring."
  },
  {
    title: "Customizable Plans",
    description: "Choose your workout frequency, target muscle groups, session duration, and preferred split."
  },
  {
    title: "Smart Exercise Selection",
    description: "Intelligently selects exercises based on your equipment access and experience level."
  }
];

const faqs = [
  {
    question: "How does it work?",
    answer: "Our app uses GPT-4 to generate personalized workout plans based on your inputs. Once generated, the workouts are automatically synced to your Hevy account using their API."
  },
  {
    question: "Do I need a Hevy account?",
    answer: "Yes, you'll need a Hevy account and API key to use this service. The API key allows us to sync your generated workouts directly to your account."
  },
  {
    question: "Is it free to use?",
    answer: "The service is currently free to use. You just need a valid Hevy account and API key."
  },
  {
    question: "Can I modify the generated workouts?",
    answer: "Yes! Once the workouts are synced to your Hevy account, you can modify them just like any other routine."
  }
];

export default function AboutPage() {
  return (
    <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
          About GenWorkout
        </h1>
        <p className="text-xl text-zinc-600 dark:text-gray-300 max-w-3xl mx-auto">
          An AI-powered workout generator that creates personalized fitness plans
          and seamlessly integrates with your Hevy workout tracking app.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid md:grid-cols-2 gap-6 mb-16"
      >
        {features.map((feature, index) => (
          <BackgroundGradient key={feature.title} className="h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-[22px] bg-white/80 dark:bg-zinc-900 h-full"
            >
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-zinc-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          </BackgroundGradient>
        ))}
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-zinc-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <BackgroundGradient key={faq.question} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-[22px] bg-white/80 dark:bg-zinc-900"
              >
                <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-zinc-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </motion.div>
            </BackgroundGradient>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center"
      >
        <Link
          href="/generate"
          className={cn(
            "inline-block rounded-full bg-blue-600 px-8 py-3 text-white",
            "hover:bg-blue-700 hover:scale-105 transform",
            "transition-all duration-200 ease-out",
            "shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
          )}
        >
          Try It Now
        </Link>
      </motion.div>
    </main>
  );
} 