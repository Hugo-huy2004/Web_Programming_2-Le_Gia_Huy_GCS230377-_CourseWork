import { useEffect } from "react"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ValuationPage from "./pages/ValuationPage/ValuationPage"
import HeritagePage from "./pages/HeritagePage/HeritagePage"
import AppointmentPage from "./pages/AppointmentPage/AppointmentPage"
import ConfirmOrderPage from "./pages/ConfirmOrderPage/ConfirmOrderPage"
import Collections from "./pages/ProductsPage/Collections"
import AccountPage from "./pages/AccountPage/AccountPage"
import ViewCart from "./pages/ViewCart/ViewCart"
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage"
import PoliciesPage from "./pages/PoliciesPage/PoliciesPage"
import { useProductStore } from "./stores/useProductStore"
import { useAuthStore } from "./stores/useAuthStore"
import { useSettingsStore } from "./stores/useSettingsStore"
import { useVoucherStore } from "./stores/useVoucherStore"
import { usePriceStore } from "./stores/usePriceStore"
import {Toaster} from "sonner"
import { toast } from "sonner"
import CartAnimationOverlay from "./components/CartAnimationOverlay"
import MobileBottomNav from "./components/MobileBottomNav"
import GlobalLoadingOverlay from "./components/GlobalLoadingOverlay"
import { AUTH_SESSION_EXPIRED_EVENT } from "@/lib/authEvents"
import { useCustomerStore } from "./stores/useCustomerStore"
 
export function App() {
  const loadProductsFromMongo = useProductStore((state) => state.loadProductsFromMongo)
  const accessToken = useAuthStore((state) => state.accessToken)
  const currentAdmin = useSettingsStore((state) => state.currentAdmin)
  const setCurrentAdmin = useSettingsStore((state) => state.setCurrentAdmin)
  const fetchSettings = useSettingsStore((state) => state.fetchSettings)
  const fetchVouchers = useVoucherStore((state) => state.fetchVouchers)
  const refreshGoldPrices = usePriceStore((state) => state.refreshGoldPrices)
  const clearSession = useAuthStore((state) => state.clearSession)
  const customerLogout = useCustomerStore((state) => state.customerLogout)
 
  useEffect(() => {
    void loadProductsFromMongo()
    void fetchSettings()
    void fetchVouchers(false)
    void refreshGoldPrices()
  }, [loadProductsFromMongo, fetchSettings, fetchVouchers, refreshGoldPrices])
 
  useEffect(() => {
    if (currentAdmin && !accessToken) {
      setCurrentAdmin(null)
    }
  }, [currentAdmin, accessToken, setCurrentAdmin])

  useEffect(() => {
    let lastHandledAt = 0

    const handleSessionExpired = (event: Event) => {
      const now = Date.now()
      if (now - lastHandledAt < 1500) return
      lastHandledAt = now

      const customEvent = event as CustomEvent<{ message?: string }>
      const reason = customEvent.detail?.message || "Your session has expired."

      clearSession()
      customerLogout()
      setCurrentAdmin(null)
      toast.error(`${reason} Please sign in again.`)

      if (window.location.pathname !== "/user") {
        window.location.assign("/user")
      }
    }

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired as EventListener)
    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired as EventListener)
    }
  }, [clearSession, customerLogout, setCurrentAdmin])
 
  return (
    <>
    <Toaster richColors position="top-right" duration={3000}/>
    <GlobalLoadingOverlay />
    <CartAnimationOverlay />
    <BrowserRouter>
      <div className="editorial-shell min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <main className="flex-1 mx-auto w-full max-w-[1600px] px-4 py-5 md:px-12 md:py-8 lg:py-10">
          <Routes>
            <Route path="/" element={<HeritagePage />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/valuation" element={<ValuationPage />} />
            <Route path="/heritage" element={<HeritagePage />} />
            <Route path="/user" element={<AccountPage />} />
            <Route path="/cart" element={<ViewCart />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/confirm" element={<ConfirmOrderPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/admin" element={<Navigate to="/user" replace />} />
            <Route path="/admin/dashboard" element={<Navigate to="/user" replace />} />
          </Routes>
        </main>
        <MobileBottomNav />
        <Footer />
      </div>
    </BrowserRouter>
    </>
  )
}

export default App
