import api from "@/lib/axios";
import axios from "axios";

type AdminLoginResponse = {
    ok?: boolean;
    success?: boolean;
    accessToken?: string;
};

export const authService = {
    adminLogin: async (username: string, password: string) => {
        try {
            const res = await api.post<AdminLoginResponse>("/auth/admin/login", { username, password });
            return res.data.accessToken ?? null;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                throw new Error("Invalid username or password.");
            }
            console.error("Login service encountered an issue:", error);
            throw error;
        }
    },

    logout: async () => {
        await api.post("/auth/logout");
    },

    fetchMe: async () => {
        try {
            const res = await api.get("/auth/profile/admin");
            return res.data;
        } catch (error) {
            console.error("Fetch profile service encountered an issue:", error);
            throw error;
        }
    }
}
