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

  const [voucherCode, setVoucherCode] = useState("")
  const [voucherDiscountAmount, setVoucherDiscountAmount] = useState("0")
  const [newAdminUsername, setNewAdminUsername] = useState("")
  const [newAdminPassword, setNewAdminPassword] = useState("")
  const [shipperFee, setShipperFee] = useState(String(settings.shipperFee))
  const [dollarsPerPoint, setDollarsPerPoint] = useState(String(settings.dollarsPerPoint))
  const [minimumPointsToRedeem, setMinimumPointsToRedeem] = useState(String(settings.minimumPointsToRedeem))
 
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
  }, [settings])
 
  const handleSaveSettings = async () => {
    const result = await updateSettings({
      shipperFee: parseNumber(shipperFee),
      dollarsPerPoint: parseNumber(dollarsPerPoint),
      minimumPointsToRedeem: parseNonNegativeInteger(minimumPointsToRedeem),
    })
    if (result.ok) {
      toast.success(result.message || "Governance updated successfully.")
      return
    }

    toast.error(result.message || "Failed to update governance settings.")
  }
 
  const handleAddVoucher = async () => {
    const result = await createVoucher(voucherCode, parseNumber(voucherDiscountAmount))
    if (result.ok) {
      toast.success(result.message || "Voucher created successfully.")
      setVoucherCode("")
      setVoucherDiscountAmount("0")
      return
    }

    toast.error(result.message || "Failed to create voucher.")
  }
 
  const handleAddAdmin = async () => {
    const result = await createAdminAccount(newAdminUsername, newAdminPassword)
    if (result.ok) {
      toast.success(result.message || "Admin account created successfully.")
      setNewAdminUsername("")
      setNewAdminPassword("")
      return
    }

    toast.error(result.message || "Failed to create admin account.")
  }
 
  return (
    <div className="animate-in fade-in duration-1000 p-6 md:p-10 space-y-24">
      <GovernanceSettingsSection
        shipperFee={shipperFee}
        onShipperFeeChange={setShipperFee}
        dollarsPerPoint={dollarsPerPoint}
        onDollarsPerPointChange={setDollarsPerPoint}
        minimumPointsToRedeem={minimumPointsToRedeem}
        onMinimumPointsToRedeemChange={setMinimumPointsToRedeem}
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
