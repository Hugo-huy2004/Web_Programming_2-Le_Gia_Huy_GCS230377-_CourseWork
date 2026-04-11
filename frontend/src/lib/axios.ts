import axios from "axios"
import { readPersistedAccessToken } from "@/lib/authSession"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api"

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
})

api.interceptors.request.use(
    (config) => {
        const token = readPersistedAccessToken()
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`
        }
        return config
    }
)

export default api;