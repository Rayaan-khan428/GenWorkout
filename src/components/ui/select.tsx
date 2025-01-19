"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const Select = React.forwardRef<
  HTMLButtonElement,
  {
    value: string;
    onValueChange: (value: string) => void;
    options: { value: string; label: string }[];
  }
>(({ value, onValueChange, options, ...props }, ref) => (
  <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm",
        "placeholder:text-zinc-400",
        "focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-zinc-900",
        "disabled:cursor-not-allowed disabled:opacity-50"
      )}
    >
      <SelectPrimitive.Value>
        {options.find(option => option.value === value)?.label}
      </SelectPrimitive.Value>
      <SelectPrimitive.Icon className="ml-2">
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-800 bg-zinc-900 text-zinc-50 shadow-md animate-in fade-in-80"
      >
        <SelectPrimitive.Viewport className="p-1">
          {options.map((option) => (
            <SelectPrimitive.Item
              key={option.value}
              value={option.value}
              className={cn(
                "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
                "focus:bg-zinc-800 focus:text-zinc-50",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              )}
            >
              <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
            </SelectPrimitive.Item>
          ))}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  </SelectPrimitive.Root>
))
Select.displayName = "Select"

export { Select } 