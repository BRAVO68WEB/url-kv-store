import { useLogto } from "@logto/react"
import { Link2, ArrowRight, Zap, Globe, BarChart3 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Layout from "@/components/Layout"
import { fetchStats, type Stats } from "@/lib/api"

function StatsDisplay() {
    const [stats, setStats] = useState<Stats | null>(null)

    useEffect(() => {
        fetchStats()
            .then(setStats)
            .catch(() => { })
    }, [])

    if (!stats) return null

    return (
        <div className="grid grid-cols-2 gap-4 mt-8">
            <Card className="bg-card/50 border-border/40 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center py-6">
                    <span className="text-3xl font-bold text-primary">{stats.total_keys}</span>
                    <span className="text-sm text-muted-foreground mt-1">Active Links</span>
                </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/40 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center py-6">
                    <span className="text-3xl font-bold text-dracula-pink">{stats.total_views}</span>
                    <span className="text-sm text-muted-foreground mt-1">Total Clicks</span>
                </CardContent>
            </Card>
        </div>
    )
}

export default function Home() {
    const { isAuthenticated, signIn } = useLogto()

    const features = [
        {
            icon: Zap,
            title: "Instant Shortening",
            description: "Create short URLs in milliseconds with Cloudflare Workers edge compute",
            color: "text-dracula-yellow",
        },
        {
            icon: Globe,
            title: "Global Edge Network",
            description: "Redirects served from 300+ Cloudflare data centers worldwide",
            color: "text-dracula-cyan",
        },
        {
            icon: BarChart3,
            title: "Click Analytics",
            description: "Track views and engagement for every link you create",
            color: "text-dracula-green",
        },
    ]

    return (
        <Layout>
            <div className="flex flex-col items-center text-center pt-12 pb-16">
                {/* Hero */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-primary/5 rounded-full blur-3xl" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                        <Link2 className="h-10 w-10 text-primary" />
                    </div>
                </div>

                <h1 className="mt-8 text-4xl sm:text-5xl font-bold tracking-tight">
                    <span className="text-primary">s.</span>
                    <span className="text-foreground">b68.dev</span>
                </h1>

                <p className="mt-4 max-w-md text-lg text-muted-foreground">
                    A blazing-fast URL shortener powered by Cloudflare Workers, KV &amp; D1.
                    Create, manage, and track your short links.
                </p>

                <div className="mt-8 flex gap-3">
                    {isAuthenticated ? (
                        <Button asChild size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                            <a href="/view">
                                Dashboard <ArrowRight className="h-4 w-4" />
                            </a>
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            className="gap-2 bg-primary hover:bg-primary/90"
                            onClick={() => signIn(import.meta.env.VITE_HOST_REDIRECT_URI)}
                        >
                            Get Started <ArrowRight className="h-4 w-4" />
                        </Button>
                    )}
                    <Button asChild variant="outline" size="lg">
                        <a
                            href="https://github.com/BRAVO68WEB/url-kv-store"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub
                        </a>
                    </Button>
                </div>

                <StatsDisplay />

                {/* Features */}
                <div className="grid sm:grid-cols-3 gap-4 mt-16 w-full max-w-2xl">
                    {features.map((f) => {
                        const Icon = f.icon
                        return (
                            <Card
                                key={f.title}
                                className="bg-card/30 border-border/30 backdrop-blur-sm text-left hover:border-primary/30 transition-colors group"
                            >
                                <CardContent className="pt-6">
                                    <Icon
                                        className={`h-8 w-8 ${f.color} mb-3 transition-transform group-hover:scale-110`}
                                    />
                                    <h3 className="font-semibold text-foreground">{f.title}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </Layout>
    )
}
