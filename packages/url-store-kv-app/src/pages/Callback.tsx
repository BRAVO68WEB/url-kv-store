import { useHandleSignInCallback } from "@logto/react"

export default function Callback() {
    const { isLoading } = useHandleSignInCallback(() => {
        window.location.href = "/"
    })

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground animate-pulse">Signing you in...</p>
                </div>
            </div>
        )
    }

    return null
}
