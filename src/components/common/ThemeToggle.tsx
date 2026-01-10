"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Chỉ render sau khi mount trên client để tránh hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = (value: string) => {
        // Fallback for browsers that don't support View Transition API
        if (!document.startViewTransition) {
            setTheme(value)
            return
        }

        // View Transition API for smooth page-wide effect
        document.startViewTransition(() => {
            setTheme(value)
        })
    }

    // Render placeholder khi chưa mount để tránh hydration mismatch
    if (!mounted) {
        return (
            <ToggleGroup
                type="single"
                value={undefined}
                onValueChange={() => {}}
                className="rounded-full border border-border bg-muted/50 p-1 h-9 gap-1 shadow-inner"
            >
                <ToggleGroupItem
                    value="light"
                    aria-label="Toggle light mode"
                    className="group rounded-full h-7 w-7 p-0 transition-all duration-300 data-[state=on]:bg-background data-[state=on]:shadow-md data-[state=on]:border-border border border-transparent hover:bg-transparent"
                >
                    <Sun className="h-4 w-4 transition-transform duration-500 scale-100 group-data-[state=on]:text-amber-500 group-data-[state=on]:fill-amber-500/10" />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="dark"
                    aria-label="Toggle dark mode"
                    className="group rounded-full h-7 w-7 p-0 transition-all duration-300 data-[state=on]:bg-background data-[state=on]:shadow-md data-[state=on]:border-border border border-transparent hover:bg-transparent"
                >
                    <Moon className="h-4 w-4 transition-transform duration-500 scale-100 group-data-[state=on]:text-blue-500 group-data-[state=on]:fill-blue-500/10" />
                </ToggleGroupItem>
            </ToggleGroup>
        )
    }

    return (
        <ToggleGroup
            type="single"
            value={resolvedTheme}
            onValueChange={(value) => {
                if (value) toggleTheme(value)
            }}
            className="rounded-full border border-border bg-muted/50 p-1 h-9 gap-1 shadow-inner"
        >
            <ToggleGroupItem
                value="light"
                aria-label="Toggle light mode"
                className="group rounded-full h-7 w-7 p-0 transition-all duration-300 data-[state=on]:bg-background data-[state=on]:shadow-md data-[state=on]:border-border border border-transparent hover:bg-transparent"
            >
                <Sun className="h-4 w-4 transition-transform duration-500 scale-100 group-data-[state=on]:text-amber-500 group-data-[state=on]:fill-amber-500/10" />
            </ToggleGroupItem>
            <ToggleGroupItem
                value="dark"
                aria-label="Toggle dark mode"
                className="group rounded-full h-7 w-7 p-0 transition-all duration-300 data-[state=on]:bg-background data-[state=on]:shadow-md data-[state=on]:border-border border border-transparent hover:bg-transparent"
            >
                <Moon className="h-4 w-4 transition-transform duration-500 scale-100 group-data-[state=on]:text-blue-500 group-data-[state=on]:fill-blue-500/10" />
            </ToggleGroupItem>
        </ToggleGroup>
    )
}
