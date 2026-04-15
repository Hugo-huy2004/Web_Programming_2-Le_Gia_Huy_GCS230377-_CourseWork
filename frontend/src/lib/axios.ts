import axios from "axios"
import { readPersistedAccessToken } from "@/lib/authSession"
import { useUiStore } from "@/stores/useUiStore"
import { emitSessionExpired } from "@/lib/authEvents"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api"

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
})

api.interceptors.request.use(
    (config) => {
        useUiStore.getState().beginRequest()
        const token = readPersistedAccessToken()
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        useUiStore.getState().endRequest()
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        useUiStore.getState().endRequest()
        return response
    },
    (error) => {
        useUiStore.getState().endRequest()

        const status = error?.response?.status
        const message = String(error?.response?.data?.message ?? error?.message ?? "")
        const lowered = message.toLowerCase()
        const token = readPersistedAccessToken()
        if (status === 401 && (Boolean(token) || lowered.includes("expired") || lowered.includes("not valid") || lowered.includes("missing access token"))) {
            emitSessionExpired(message)
        }

        return Promise.reject(error)
    }
)

export default api;