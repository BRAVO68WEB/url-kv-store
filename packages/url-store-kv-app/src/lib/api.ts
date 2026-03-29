import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    headers: {
        "Content-Type": "application/json",
    },
})

/** Attach Logto access token to every request */
export function setAuthToken(token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

export interface KVKey {
    name: string
    expiration?: number
    metadata?: unknown
}

export interface KeyViewData {
    results: { linkid: string; count: number; updated_at: string }[]
    value: string
}

export interface Stats {
    total_keys: number
    total_views: number
}

export const keysList = async (): Promise<{ keys: KVKey[] }> => {
    const { data } = await api.get("/list/keys")
    return data
}

export const getKey = async (keyname: string): Promise<KeyViewData> => {
    const { data } = await api.get(`/view/${keyname}`)
    return data
}

export const createKey = async (keyname: string, url: string) => {
    const { data } = await api.post("/create", { url, key: keyname })
    return data
}

export const updateKey = async (keyname: string, url: string) => {
    const { data } = await api.post("/create", { url, key: keyname })
    return data
}

export const deleteKey = async (keyname: string) => {
    const { data } = await api.delete(`/${keyname}`)
    return data
}

export const fetchStats = async (): Promise<Stats> => {
    const { data } = await api.get("/stats")
    return data
}

export const checkKey = async (key: string): Promise<boolean> => {
    const { data } = await api.get(`/check/${key}`)
    return !data.error
}
