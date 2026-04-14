import { GoogleLogin } from "@react-oauth/google"
import AdminControlCenter from "@/pages/AccountPage/AdminPage/AdminControlCenter"
import CustomerDashboardPage from "./UserPage/CustomerDashboardPage"
import { useAuthStore } from "@/stores/useAuthStore"
import { hasCompleteCustomerProfile, useCustomerStore } from "@/stores/useCustomerStore"
import { useOrderStore } from "@/stores/useOrderStore"
import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { CredentialResponse } from "@react-oauth/google"
import CustomerProfileRequiredForm from "@/components/auth/CustomerProfileRequiredForm"

const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type AdminLoginFormData = z.infer<typeof adminLoginSchema>

export default function AccountPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  })

  const { adminLogin, loading, admin, logout } = useAuthStore()
  const { activeCustomerEmail, activeCustomer, loginWithGoogle, setActiveCustomerEmail } = useCustomerStore()
  const { fetchOrders } = useOrderStore()
  const [selectedTab, setSelectedTab] = useState<"customer" | "admin">(
    "customer"
  )
  const isGuest = !admin && !activeCustomerEmail
  const needsProfileCompletion = Boolean(activeCustomerEmail) && !hasCompleteCustomerProfile(activeCustomer)

  useEffect(() => {
    if (activeCustomerEmail) {
      void fetchOrders(null, activeCustomerEmail)
    }
  }, [activeCustomerEmail, fetchOrders])

  useEffect(() => {
    if (errors.username?.message) {
      toast.error(errors.username.message)
    }
  }, [errors.username?.message])

  useEffect(() => {
    if (errors.password?.message) {
      toast.error(errors.password.message)
    }
  }, [errors.password?.message])

  const handleAdminLogin = async (data: AdminLoginFormData) => {
    const success = await adminLogin(data.username, data.password)

    if (success) {
      setActiveCustomerEmail(null)
      toast.success("Admin login successful!")
      return
    }

    toast.error("Admin login failed!")
  }

  const handleGoogleLogin = async (response: CredentialResponse) => {
    if (admin) {
      await logout()
    }

    const result = await loginWithGoogle(response)
    if (result.ok) {
      const latestCustomer = useCustomerStore.getState().activeCustomer
      if (!hasCompleteCustomerProfile(latestCustomer)) {
        toast.info("Please complete your profile to continue to cart and checkout.")
      }
      toast.success("Customer login successful!")
      return
    }

    toast.error(result.message || "Google login failed!")
  }

  const renderCustomerLogin = () => (
    <div className="flex w-full flex-col items-center">
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => toast.error("Google login was cancelled or failed.")}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  )

  const renderAdminLogin = () => (
    <form onSubmit={handleSubmit(handleAdminLogin)} className="space-y-4">
      <input
        type="text"
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none focus:ring-1 focus:ring-black"
        placeholder="Username"
        {...register("username")}
      />

      <input
        type="password"
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none focus:ring-1 focus:ring-black"
        placeholder="Password"
        {...register("password")}
      />

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 text-base font-semibold text-white hover:bg-gray-900 disabled:opacity-50"
      >
        {loading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  )

  if (isGuest) {
    return (
      <div className="liquid-glass-strong mx-auto mt-12 w-full max-w-[400px] rounded-xl border border-gray-100 p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)]">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h2>
        </div>

        <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setSelectedTab("customer")}
            className={`flex-1 rounded-md py-2.5 text-base font-semibold transition-all ${selectedTab === "customer" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
          >
            Customer
          </button>
          <button
            onClick={() => setSelectedTab("admin")}
            className={`flex-1 rounded-md py-2.5 text-base font-semibold transition-all ${selectedTab === "admin" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
          >
            Admin
          </button>
        </div>

        {selectedTab === "customer" && (
          renderCustomerLogin()
        )}

        {selectedTab === "admin" && (
          renderAdminLogin()
        )}
      </div>
    )
  }

  if (admin) {
    return (
      <div className="flex w-full justify-center pt-8">
        <div className="w-full max-w-7xl px-4 md:px-8">
          <AdminControlCenter currentAdmin={admin} handleLogout={() => void logout()} />
        </div>
      </div>
    )
  }

  if (needsProfileCompletion) {
    return (
      <div className="relative">
        <div className="pointer-events-none select-none blur-[3px] opacity-70">
          <CustomerDashboardPage />
        </div>
        <CustomerProfileRequiredForm />
      </div>
    )
  }

  return <CustomerDashboardPage />
}
