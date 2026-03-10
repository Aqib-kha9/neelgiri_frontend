"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ThemeSwitcherInner } from "@/components/theme-switcher-inner"

export function ThemeSwitcher() {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="outline" size="icon">
                <span className="sr-only">Toggle theme</span>
            </Button>
        )
    }

    return <ThemeSwitcherInner />
}
