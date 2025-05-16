"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState, useEffect } from "react";

const navItems = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/generate",
    name: "Generate",
  },
  {
    path: "/about",
    name: "About",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <motion.header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-lg dark:shadow-zinc-900/10 py-2" 
          : "bg-transparent py-4"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="relative group"
          >
            <div className="flex items-center">
              <div className="mr-2 relative">
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center transform transition-transform group-hover:rotate-6 group-hover:scale-110">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <motion.div 
                  className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-lg blur-xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </div>
              <div className="text-xl font-bold">
                <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">Gen</span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">Workout</span>
              </div>
            </div>
          </Link>

          <div className="flex items-center space-x-1">
            <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-1 rounded-full hidden sm:flex">
              {navItems.map(({ path, name }) => {
                const isActive = pathname === path;
                return (
                  <Link
                    key={path}
                    href={path}
                    className="relative px-4 py-2 rounded-full"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                    <motion.span
                      className={cn(
                        "relative z-10 text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent" 
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      )}
                      whileHover={{ scale: 1.05 }}
                    >
                      {name}
                    </motion.span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile navigation indicator */}
            <div className="flex sm:hidden space-x-1">
              {navItems.map(({ path, name }) => {
                const isActive = pathname === path;
                return (
                  <Link
                    key={path}
                    href={path}
                    className="relative w-2 h-2"
                  >
                    <motion.div 
                      animate={{ 
                        scale: isActive ? [1, 1.2, 1] : 1,
                        backgroundColor: isActive ? '#3b82f6' : '#6b7280',
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: isActive ? Infinity : 0,
                        repeatType: "reverse",
                      }}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        isActive ? "bg-blue-500 dark:bg-blue-400" : "bg-zinc-500 dark:bg-zinc-600"
                      )}
                    />
                  </Link>
                );
              })}
            </div>
            
            <div className={cn(
              "ml-2 p-2 rounded-full transition-colors",
              scrolled ? "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm" : "bg-zinc-100/80 dark:bg-zinc-800/50"
            )}>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
} 