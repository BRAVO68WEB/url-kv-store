import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { LogtoProvider } from "@logto/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

import "./index.css"

import Home from "@/pages/Home"
import ViewKeys from "@/pages/ViewKeys"
import CreateKey from "@/pages/CreateKey"
import UpdateKey from "@/pages/UpdateKey"
import Callback from "@/pages/Callback"

const config = {
    endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
    appId: import.meta.env.VITE_LOGTO_APPID,
}

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/view", element: <ViewKeys /> },
    { path: "/create", element: <CreateKey /> },
    {
        path: "/update/:key",
        element: <UpdateKey />,
        loader: async ({ params }) => ({ key: params.key }),
    },
    { path: "/callback", element: <Callback /> },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <LogtoProvider config={config}>
            <TooltipProvider delay={200}>
                <RouterProvider router={router} />
                <Toaster
                    position="bottom-right"
                    theme="dark"
                    richColors
                    toastOptions={{
                        style: {
                            background: "oklch(0.34 0.02 270)",
                            border: "1px solid oklch(0.5 0.05 265 / 40%)",
                            color: "oklch(0.965 0.01 105)",
                        },
                    }}
                />
            </TooltipProvider>
        </LogtoProvider>
    </React.StrictMode>
)
