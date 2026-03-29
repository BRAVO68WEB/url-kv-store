import { useState, useEffect } from "react"
import { useLogto } from "@logto/react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import {
    ExternalLink,
    PlusCircle,
    Search,
    Copy,
    BarChart3,
    Link2,
} from "lucide-react"

import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { keysList, fetchStats, type KVKey, type Stats } from "@/lib/api"
import { copyToClipboard, shortUrl } from "@/lib/utils"

export default function ViewKeys() {
    const [keys, setKeys] = useState<KVKey[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    const { isAuthenticated, isLoading } = useLogto()
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoading) return
        if (!isAuthenticated) {
            toast.error("You must be signed in to view links")
            setTimeout(() => navigate("/"), 2000)
            return
        }

        Promise.all([keysList(), fetchStats()])
            .then(([keyData, statsData]) => {
                setKeys(keyData.keys)
                setStats(statsData)
                setLoading(false)
                toast.success(`Loaded ${keyData.keys.length} links`)
            })
            .catch((err) => {
                toast.error(err.message)
                setLoading(false)
            })
    }, [isLoading, isAuthenticated, navigate])

    if (!isAuthenticated && !isLoading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold">Unauthorized</h2>
                    <p className="text-muted-foreground mt-2">Sign in to manage your links</p>
                    <Button onClick={() => navigate("/")} className="mt-6">
                        Go Home
                    </Button>
                </div>
            </Layout>
        )
    }

    const filteredKeys = keys.filter((k) =>
        k.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleCopy = (code: string) => {
        copyToClipboard(shortUrl(code))
        toast.success("Copied to clipboard!", { description: shortUrl(code) })
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Manage your shortened URLs</p>
                    </div>
                    <Button
                        onClick={() => navigate("/create")}
                        className="gap-2 bg-primary hover:bg-primary/90"
                    >
                        <PlusCircle className="h-4 w-4" /> New Link
                    </Button>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-card/50 border-border/40">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Link2 className="h-4 w-4" /> Active Links
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <span className="text-3xl font-bold text-primary">{stats.total_keys}</span>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50 border-border/40">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <BarChart3 className="h-4 w-4" /> Total Clicks
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <span className="text-3xl font-bold text-dracula-pink">{stats.total_views}</span>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search links..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-card/50 border-border/40"
                    />
                </div>

                {/* Table */}
                <Card className="bg-card/30 border-border/30">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            </div>
                        ) : filteredKeys.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Link2 className="h-10 w-10 text-muted-foreground mb-3" />
                                <p className="text-muted-foreground">
                                    {search ? "No matching links found" : "No links yet. Create one!"}
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-border/30">
                                        <TableHead className="text-muted-foreground">Slug</TableHead>
                                        <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredKeys.map((key) => (
                                        <TableRow
                                            key={key.name}
                                            className="border-border/20 hover:bg-primary/5 transition-colors cursor-pointer group"
                                            onClick={() => navigate(`/update/${key.name}`)}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono">
                                                        {key.name.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                            {key.name}
                                                        </span>
                                                        <p className="text-xs text-muted-foreground">{shortUrl(key.name)}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleCopy(key.name)
                                                                }}
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Copy short URL</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <a
                                                                href={shortUrl(key.name)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-dracula-green"
                                                                >
                                                                    <ExternalLink className="h-4 w-4" />
                                                                </Button>
                                                            </a>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Open link</TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Count */}
                {!loading && (
                    <p className="text-xs text-muted-foreground text-center">
                        Showing {filteredKeys.length} of {keys.length} links
                    </p>
                )}
            </div>
        </Layout>
    )
}
