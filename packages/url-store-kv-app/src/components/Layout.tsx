import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useLogto } from "@logto/react"
import { Link2, LayoutDashboard, PlusCircle, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { setAuthToken } from "@/lib/api"

interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const { isAuthenticated, signIn, signOut, getIdToken } = useLogto()
    const location = useLocation()

    useEffect(() => {
        if (isAuthenticated) {
            getIdToken()
                .then((token) => {
                    if (token) setAuthToken(token)
                })
                .catch(console.error)
        }
    }, [isAuthenticated, getIdToken])

    const navItems = [
        { to: "/", icon: Link2, label: "Home" },
        ...(isAuthenticated
            ? [
                { to: "/view", icon: LayoutDashboard, label: "Dashboard" },
                { to: "/create", icon: PlusCircle, label: "Create" },
            ]
            : []),
    ]

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/25 transition-all group-hover:bg-primary/20 group-hover:ring-primary/40">
                            <Link2 className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            <span className="text-primary">s.</span>
                            <span className="text-foreground">b68.dev</span>
                        </span>
                    </Link>

                    <nav className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = location.pathname === item.to
                            return (
                                <Tooltip key={item.to}>
                                    <TooltipTrigger asChild>
                                        <Link to={item.to}>
                                            <Button
                                                variant={isActive ? "secondary" : "ghost"}
                                                size="sm"
                                                className={`gap-2 transition-all ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                                    }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span className="hidden sm:inline">{item.label}</span>
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>{item.label}</TooltipContent>
                                </Tooltip>
                            )
                        })}

                        <div className="ml-2 h-6 w-px bg-border" />

                        {isAuthenticated ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => signOut(import.meta.env.VITE_HOST_URI)}
                                        className="gap-2 text-muted-foreground hover:text-destructive"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span className="hidden sm:inline">Sign Out</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Sign Out</TooltipContent>
                            </Tooltip>
                        ) : (
                            <Button
                                size="sm"
                                onClick={() => signIn(import.meta.env.VITE_HOST_REDIRECT_URI)}
                                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                <LogIn className="h-4 w-4" />
                                <span>Sign In</span>
                            </Button>
                        )}
                    </nav>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1">
                <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/30 py-6">
                <div className="mx-auto max-w-5xl px-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        © {new Date().getFullYear()}{" "}
                        <a
                            href="https://itsmebravo.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Bravo68web
                        </a>
                    </span>
                    <a
                        href="https://github.com/BRAVO68WEB/url-kv-store"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors"
                    >
                        GitHub
                    </a>
                </div>
            </footer>
        </div>
    )
}
