"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import { useStore } from "@/store/useStore"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const setCursorType = useStore((state) => state.setCursorType)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full w-12 h-12 bg-background/80 backdrop-blur-sm border-2 hover:border-primary transition-all shadow-lg"
            onMouseEnter={() => setCursorType('hover')}
            onMouseLeave={() => setCursorType('default')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Changer le thème</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="mb-2">
          <DropdownMenuItem 
            onClick={() => setTheme("light")}
            className="flex items-center gap-2"
            onMouseEnter={() => setCursorType('hover')}
            onMouseLeave={() => setCursorType('default')}
          >
            <Sun className="h-4 w-4" />
            <span>Light</span>
            {theme === "light" && <span className="ml-auto text-xs text-primary">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("dark")}
            className="flex items-center gap-2"
            onMouseEnter={() => setCursorType('hover')}
            onMouseLeave={() => setCursorType('default')}
          >
            <Moon className="h-4 w-4" />
            <span>Dark</span>
            {theme === "dark" && <span className="ml-auto text-xs text-primary">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("system")}
            className="flex items-center gap-2"
            onMouseEnter={() => setCursorType('hover')}
            onMouseLeave={() => setCursorType('default')}
          >
            <Laptop className="h-4 w-4" />
            <span>System</span>
            {theme === "system" && <span className="ml-auto text-xs text-primary">✓</span>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}