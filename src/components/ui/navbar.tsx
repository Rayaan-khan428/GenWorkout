"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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

  return (
    <header className="fixed top-0 w-full z-50 bg-white/50 dark:bg-black/50 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/"
            className="text-xl font-bold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Gen<span className="text-blue-600 dark:text-blue-400">Workout</span>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map(({ path, name }) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={path}
                  href={path}
                  className="relative px-3 py-2"
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800/50 rounded-md"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 text-sm transition-colors",
                      isActive 
                        ? "text-blue-600 dark:text-blue-400 font-medium" 
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    )}
                  >
                    {name}
                  </span>
                </Link>
              );
            })}
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
} 