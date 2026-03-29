import { useState, useEffect } from "react"
import { useLogto } from "@logto/react"
import { useNavigate, useLoaderData } from "react-router-dom"
import { toast } from "sonner"
import {
    ArrowLeft,
    Save,
    Trash2,
    Eye,
    Clock,
    Copy,
    ExternalLink,
    Link2,
} from "lucide-react"

import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { getKey, updateKey, deleteKey } from "@/lib/api"
import { copyToClipboard, formatDate, shortUrl } from "@/lib/utils"

export default function UpdateKey() {
    const { key } = useLoaderData() as { key: string }
    const { isAuthenticated, isLoading } = useLogto()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [value, setValue] = useState("")
    const [views, setViews] = useState(0)
    const [lastViewed, setLastViewed] = useState("")
    const [deleteOpen, setDeleteOpen] = useState(false)

    useEffect(() => {
        if (isLoading) return
        if (!isAuthenticated) {
            toast.error("Sign in to edit links")
            setTimeout(() => navigate("/"), 2000)
            return
        }

        getKey(key)
            .then((data) => {
                setValue(data.value)
                setViews(data.results[0]?.count || 0)
                setLastViewed(data.results[0]?.updated_at || "")
                setLoading(false)
            })
            .catch((err) => {
                toast.error(err.message)
                setLoading(false)
            })
    }, [key, isLoading, isAuthenticated, navigate])

    const handleSave = async () => {
        if (!value.trim()) {
            toast.error("URL is required")
            return
        }
        setSaving(true)
        try {
            await updateKey(key, value)
            toast.success("Link updated!")
            setTimeout(() => navigate("/view"), 1500)
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await deleteKey(key)
            toast.success("Link deleted")
            setDeleteOpen(false)
            setTimeout(() => navigate("/view"), 1000)
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setDeleting(false)
        }
    }

    const handleCopy = () => {
        copyToClipboard(shortUrl(key))
        toast.success("Copied!", { description: shortUrl(key) })
    }

    if (!isAuthenticated && !isLoading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold">Unauthorized</h2>
                    <Button onClick={() => navigate("/")} className="mt-6">Go Home</Button>
                </div>
            </Layout>
        )
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

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                ) : (
                    <>
                        {/* Short URL card */}
                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <Link2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-mono font-medium text-primary">{shortUrl(key)}</p>
                                        <p className="text-xs text-muted-foreground">Short URL</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleCopy}
                                                className="text-muted-foreground hover:text-primary"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Copy</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a href={shortUrl(key)} target="_blank" rel="noopener noreferrer">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-dracula-green"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>Visit</TooltipContent>
                                    </Tooltip>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Analytics */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-card/50 border-border/40">
                                <CardContent className="flex items-center gap-3 py-4">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-dracula-cyan/10">
                                        <Eye className="h-4 w-4 text-dracula-cyan" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">{views}</p>
                                        <p className="text-xs text-muted-foreground">Total Views</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-card/50 border-border/40">
                                <CardContent className="flex items-center gap-3 py-4">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-dracula-orange/10">
                                        <Clock className="h-4 w-4 text-dracula-orange" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{formatDate(lastViewed)}</p>
                                        <p className="text-xs text-muted-foreground">Last Viewed</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Edit form */}
                        <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">Edit Link</CardTitle>
                                <CardDescription>
                                    Update the destination for{" "}
                                    <Badge variant="secondary" className="font-mono">
                                        {key}
                                    </Badge>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Slug</Label>
                                    <Input value={key} disabled className="bg-muted/50 font-mono" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="url">Destination URL</Label>
                                    <Textarea
                                        id="url"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="bg-background/50 border-border/40 min-h-[80px] font-mono text-sm"
                                        placeholder="https://example.com"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                                    >
                                        {saving ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                        ) : (
                                            <Save className="h-4 w-4" />
                                        )}
                                        {saving ? "Saving..." : "Save Changes"}
                                    </Button>

                                    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-card border-border/40">
                                            <DialogHeader>
                                                <DialogTitle>Delete Link</DialogTitle>
                                                <DialogDescription>
                                                    Are you sure you want to delete{" "}
                                                    <span className="font-mono text-foreground">{shortUrl(key)}</span>?
                                                    This action cannot be undone.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className="gap-2">
                                                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={handleDelete}
                                                    disabled={deleting}
                                                    className="gap-2"
                                                >
                                                    {deleting ? (
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                    {deleting ? "Deleting..." : "Delete"}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </Layout>
    )
}
