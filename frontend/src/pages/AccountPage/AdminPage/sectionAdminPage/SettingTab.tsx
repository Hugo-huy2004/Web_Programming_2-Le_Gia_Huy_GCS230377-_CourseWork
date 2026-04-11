import { useEffect, useState } from "react"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { useVoucherStore } from "@/stores/useVoucherStore"
import { useAppStore } from "@/stores/useAppStore"
import { AdminAccessSection } from "@/components/admin/settings/AdminAccessSection"
import { GovernanceSettingsSection } from "@/components/admin/settings/GovernanceSettingsSection"
import { VoucherManagementSection } from "@/components/admin/settings/VoucherManagementSection"
import { confirmWithToast } from "@/lib/toastConfirm"
import { toast } from "sonner"
 
const parseNumber = (value: string): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}
 
const parseNonNegativeInteger = (value: string): number => {
  return Math.max(0, Math.floor(parseNumber(value)))
}
 
const SettingTab = () => {
  const {
    admins,
    fetchAdmins,
    createAdminAccount,
    settings,
    fetchSettings,
    updateSettings,
  } = useSettingsStore()

  const {
    vouchers,
    fetchVouchers,
    createVoucher,
    toggleVoucherStatus,
    deleteVoucher,
  } = useVoucherStore()

  const { formatUsd } = useAppStore()
 
  const [message, setMessage] = useState("")
  const [voucherCode, setVoucherCode] = useState("")
  const [voucherDiscountAmount, setVoucherDiscountAmount] = useState("0")
  const [newAdminUsername, setNewAdminUsername] = useState("")
  const [newAdminPassword, setNewAdminPassword] = useState("")
  const [shipperFee, setShipperFee] = useState(String(settings.shipperFee))
  const [dollarsPerPoint, setDollarsPerPoint] = useState(String(settings.dollarsPerPoint))
  const [minimumPointsToRedeem, setMinimumPointsToRedeem] = useState(String(settings.minimumPointsToRedeem))
  const [pickupAddress, setPickupAddress] = useState(settings.pickupAddress)
 
  useEffect(() => {
    fetchSettings()
    fetchAdmins()
    fetchVouchers(true)
  }, [fetchSettings, fetchAdmins, fetchVouchers])
 
  useEffect(() => {
    if (!settings) return
    setShipperFee(String(settings.shipperFee ?? 25))
    setDollarsPerPoint(String(settings.dollarsPerPoint ?? 100))
    setMinimumPointsToRedeem(String(settings.minimumPointsToRedeem ?? 10))
    setPickupAddress(settings.pickupAddress ?? "HWJ Headquarters, 20 Cong Hoa Garden, Tan Binh Ward, Hoc Chi Minh City, Vietnam")
  }, [settings])
 
  const handleSaveSettings = async () => {
    const result = await updateSettings({
      shipperFee: parseNumber(shipperFee),
      dollarsPerPoint: parseNumber(dollarsPerPoint),
      minimumPointsToRedeem: parseNonNegativeInteger(minimumPointsToRedeem),
      pickupAddress,
    })
    setMessage(result.message)
    setTimeout(() => setMessage(""), 3000)
  }
 
  const handleAddVoucher = async () => {
    const result = await createVoucher(voucherCode, parseNumber(voucherDiscountAmount))
    setMessage(result.message)
    if (result.ok) {
      setVoucherCode("")
      setVoucherDiscountAmount("0")
    }
    setTimeout(() => setMessage(""), 3000)
  }
 
  const handleAddAdmin = async () => {
    const result = await createAdminAccount(newAdminUsername, newAdminPassword)
    setMessage(result.message)
    if (result.ok) {
      setNewAdminUsername("")
      setNewAdminPassword("")
    }
    setTimeout(() => setMessage(""), 3000)
  }
 
  return (
    <div className="animate-in fade-in duration-1000 p-6 md:p-10 space-y-24">
      <GovernanceSettingsSection
        message={message}
        shipperFee={shipperFee}
        onShipperFeeChange={setShipperFee}
        dollarsPerPoint={dollarsPerPoint}
        onDollarsPerPointChange={setDollarsPerPoint}
        minimumPointsToRedeem={minimumPointsToRedeem}
        onMinimumPointsToRedeemChange={setMinimumPointsToRedeem}
        pickupAddress={pickupAddress}
        onPickupAddressChange={setPickupAddress}
        onSaveSettings={handleSaveSettings}
      />

      <VoucherManagementSection
        vouchers={vouchers}
        voucherCode={voucherCode}
        onVoucherCodeChange={setVoucherCode}
        voucherDiscountAmount={voucherDiscountAmount}
        onVoucherDiscountAmountChange={setVoucherDiscountAmount}
        onAddVoucher={handleAddVoucher}
        onToggleVoucherStatus={toggleVoucherStatus}
        onDeleteVoucher={(voucherId) => {
          confirmWithToast({
            message: "Permanently purge this privilege record?",
            confirmLabel: "Purge",
            onConfirm: async () => {
              await deleteVoucher(voucherId)
              toast.success("Voucher purge request completed.")
            },
          })
        }}
        formatUsd={formatUsd}
      />

      <AdminAccessSection
        admins={admins}
        newAdminUsername={newAdminUsername}
        onNewAdminUsernameChange={setNewAdminUsername}
        newAdminPassword={newAdminPassword}
        onNewAdminPasswordChange={setNewAdminPassword}
        onAddAdmin={handleAddAdmin}
      />
    </div>
  )
}
 
export default SettingTab
