import { useState } from "react"
import { useLogto } from "@logto/react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Dices, Save, ArrowLeft, Link2, Globe } from "lucide-react"

import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

import { createKey, checkKey } from "@/lib/api"
import { generateCode, shortUrl } from "@/lib/utils"

export default function CreateKey() {
    const { isAuthenticated, isLoading } = useLogto()
    const [slug, setSlug] = useState("")
    const [url, setUrl] = useState("")
    const [saving, setSaving] = useState(false)
    const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
    const navigate = useNavigate()

    if (!isAuthenticated && !isLoading) {
        toast.error("Sign in to create a link")
        setTimeout(() => navigate("/"), 2000)
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold">Unauthorized</h2>
                    <p className="text-muted-foreground mt-2">Sign in to create links</p>
                    <Button onClick={() => navigate("/")} className="mt-6">Go Home</Button>
                </div>
            </Layout>
        )
    }

    const handleRandomize = () => {
        const code = generateCode(6)
        setSlug(code)
        setSlugAvailable(null)
    }

    const handleSlugChange = async (value: string) => {
        setSlug(value)
        setSlugAvailable(null)
        if (value.length >= 2) {
            try {
                const exists = await checkKey(value)
                setSlugAvailable(!exists)
            } catch {
                setSlugAvailable(null)
            }
        }
    }

    const handleSave = async () => {
        if (!slug.trim()) {
            toast.error("Slug is required")
            return
        }
        if (!url.trim()) {
            toast.error("URL is required")
            return
        }

        setSaving(true)
        try {
            await createKey(slug, url)
            toast.success("Link created!", { description: shortUrl(slug) })
            setTimeout(() => navigate("/view"), 1500)
        } catch (err: any) {
            toast.error(err.message || "Failed to create link")
        } finally {
            setSaving(false)
        }
    }

    return (
        <Layout>
            <div className="max-w-lg mx-auto space-y-6">
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/view")}
                        className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </div>

                <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Link2 className="h-6 w-6 text-primary" />
                            Create Short Link
                        </CardTitle>
                        <CardDescription>
                            Create a new shortened URL on <Badge variant="secondary">s.b68.dev</Badge>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Slug */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="slug">Slug</Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRandomize}
                                    className="gap-1 text-xs text-muted-foreground hover:text-primary h-7"
                                >
                                    <Dices className="h-3 w-3" /> Randomize
                                </Button>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    s.b68.dev/
                                </span>
                                <Input
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => handleSlugChange(e.target.value)}
                                    className="pl-[5.5rem] bg-background/50 border-border/40"
                                    placeholder="my-link"
                                />
                                {slugAvailable !== null && slug.length >= 2 && (
                                    <span
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium ${slugAvailable ? "text-dracula-green" : "text-destructive"
                                            }`}
                                    >
                                        {slugAvailable ? "Available" : "Taken"}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* URL */}
                        <div className="space-y-2">
                            <Label htmlFor="url">Destination URL</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="pl-10 bg-background/50 border-border/40"
                                    placeholder="https://example.com/very/long/url"
                                    type="url"
                                />
                            </div>
                        </div>

                        {/* Preview */}
                        {slug && url && (
                            <div className="rounded-lg bg-background/50 border border-border/30 p-4 space-y-2">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Preview</p>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-sm">
                                        {shortUrl(slug)}
                                    </Badge>
                                    <span className="text-muted-foreground">→</span>
                                    <span className="text-sm text-foreground truncate">{url}</span>
                                </div>
                            </div>
                        )}

                        {/* Save */}
                        <Button
                            onClick={handleSave}
                            disabled={saving || !slug.trim() || !url.trim()}
                            className="w-full gap-2 bg-primary hover:bg-primary/90"
                            size="lg"
                        >
                            {saving ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {saving ? "Creating..." : "Create Link"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    )
}
