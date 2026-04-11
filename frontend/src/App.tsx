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
import CartAnimationOverlay from "./components/CartAnimationOverlay"
import MobileBottomNav from "./components/MobileBottomNav"
 
export function App() {
  const loadProductsFromMongo = useProductStore((state) => state.loadProductsFromMongo)
  const accessToken = useAuthStore((state) => state.accessToken)
  const currentAdmin = useSettingsStore((state) => state.currentAdmin)
  const setCurrentAdmin = useSettingsStore((state) => state.setCurrentAdmin)
  const fetchSettings = useSettingsStore((state) => state.fetchSettings)
  const fetchVouchers = useVoucherStore((state) => state.fetchVouchers)
  const refreshGoldPrices = usePriceStore((state) => state.refreshGoldPrices)
 
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
 
  return (
    <>
    <Toaster richColors position="top-right" duration={3000}/>
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
