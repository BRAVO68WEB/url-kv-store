/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_HOST: string
    readonly VITE_HOST_URI: string
    readonly VITE_HOST_REDIRECT_URI: string
    readonly VITE_LOGTO_ENDPOINT: string
    readonly VITE_LOGTO_APPID: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
