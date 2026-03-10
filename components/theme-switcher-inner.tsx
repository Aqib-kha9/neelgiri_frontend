"use client"

import * as React from "react"
import { Moon, Sun, Check } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ThemeSwitcherInner() {
    const { setTheme, theme } = useTheme()
    const [activeColor, setActiveColor] = React.useState("")

    const colors = [
        { name: "Default", value: "" },
        { name: "Blue", value: "theme-blue" },
        { name: "Green", value: "theme-green" },
        { name: "Purple", value: "theme-purple" },
    ]

    React.useEffect(() => {
        const root = window.document.documentElement
        colors.forEach(c => {
            if (c.value) root.classList.remove(c.value)
        })
        if (activeColor) root.classList.add(activeColor)
    }, [activeColor])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mode</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("black")}>
                    Black {theme === "black" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("navy")}>
                    Navy {theme === "navy" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("forest")}>
                    Forest {theme === "forest" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Color</DropdownMenuLabel>
                {colors.map((color) => (
                    <DropdownMenuItem key={color.name} onClick={() => setActiveColor(color.value)}>
                        <div className={cn("mr-2 h-4 w-4 rounded-full border",
                            color.value === "" ? "bg-zinc-200" :
                                color.value === "theme-blue" ? "bg-blue-500" :
                                    color.value === "theme-green" ? "bg-green-500" :
                                        "bg-purple-500"
                        )} />
                        {color.name}
                        {activeColor === color.value && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                ))}

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
