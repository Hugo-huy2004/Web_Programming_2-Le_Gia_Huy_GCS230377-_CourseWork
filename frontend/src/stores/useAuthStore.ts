import type { AuthState } from "@/types/auth"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authService } from "@/services/authService"

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const hydrateProfile = async (): Promise<boolean> => {
        try {
          const result = await authService.fetchMe();
          console.log("result from fetchMe:", result);

          if (result.role === "admin") {
            set({ admin: result.user, customer: null });
            return true
          }

          if (result.role === "customer") {
            set({ customer: result.user, admin: null });
            return true
          }

          set({ admin: null, customer: null });
          return false
        } catch (error) {
          console.error("Fetch profile error:", error);
          set({ admin: null, customer: null });
          return false
        }
      }

      return {
      loading: false,
      accessToken: null,
      admin: null,
      customer: null,
      clearSession: () => {
        set({ accessToken: null, admin: null, customer: null })
      },
      adminLogin: async (username, password) => {
        set({ loading: true, admin: null, customer: null })
        try {
          const token = await authService.adminLogin(username, password);
          if (!token) {
            get().clearSession()
            return false
          }

          set({ accessToken: token })
          const isProfileReady = await hydrateProfile()

          if (!isProfileReady) {
            get().clearSession()
            return false
          }

          console.log("Login successful. Ready for secure requests.");
          return true
        } catch (error) {
          get().clearSession()
          if (error instanceof Error && error.message === "Invalid username or password.") {
            return false
          }
          console.error('Authorization error:', error)
          return false
        } finally {
          set({ loading: false })
        }
      },

      logout: async () => {
        try {
          set({ loading: true })
          await authService.logout();
          get().clearSession()
          console.log("Session terminated.");
        } catch (error) {
          console.error('Logout error encountered:', error);
          get().clearSession()
        } finally {
          set({ loading: false })
        }
      },
      
      fetchProfile: async () => {
        try {
          if (!get().accessToken) {
            get().clearSession()
            return
          }

          set({ loading: true })
          const isProfileReady = await hydrateProfile()
          if (!isProfileReady) {
            get().clearSession()
          }
        } finally {
          set({ loading: false })
        }
      }
    }
  },

    {
      name: "auth-state",
      partialize: (state) => ({
        accessToken: state.accessToken,
        admin: state.admin,
        customer: state.customer,
      }),
    }
  )
)
