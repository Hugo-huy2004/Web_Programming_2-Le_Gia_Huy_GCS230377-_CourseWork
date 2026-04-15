import { CollectorIdentitySection } from "@/components/order/CollectorIdentitySection"
import { FinancialFrameworkSection } from "@/components/order/FinancialFrameworkSection"
import { OrderCompletedState } from "@/components/order/ConfirmOrderStates"
import { OrderSummaryAside } from "@/components/order/OrderSummaryAside"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useCartStore } from "@/stores/useCartStore"
import { useProductStore } from "@/stores/useProductStore"
import { useCustomerStore } from "@/stores/useCustomerStore"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { useVoucherStore } from "@/stores/useVoucherStore"
import { useOrderStore } from "@/stores/useOrderStore"
import { useAuthStore } from "@/stores/useAuthStore"
import { calculateOrderSummary } from "@/lib/orderCalculations"
import { formatUsd } from "@/lib/formatUtils"
import { rememberPostLoginRedirect, showAuthToastOnce } from "@/lib/authRedirect"
import type { ShippingMethod } from "@/types/store"

const ConfirmOrderPage = () => {
  const navigate = useNavigate()
  const { cartItems } = useCartStore()
  const { products, getProductPricing } = useProductStore()
  const { activeCustomer, activeCustomerEmail } = useCustomerStore()
  const accessToken = useAuthStore((state) => state.accessToken)
  const { settings } = useSettingsStore()
  const { getVoucherByCode } = useVoucherStore()
  const { placeOrder } = useOrderStore()

  const [receiverName, setReceiverName] = useState("")
  const [receiverPhone, setReceiverPhone] = useState("")
  const [shippingAddress, setShippingAddress] = useState("")
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("shipper")
  const [note, setNote] = useState("")
  const [voucherInput, setVoucherInput] = useState("")
  const [appliedVoucherCode, setAppliedVoucherCode] = useState("")
  const [pointsToUse, setPointsToUse] = useState("0")
  const [completedOrderCode, setCompletedOrderCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paypalQuotedTotal, setPaypalQuotedTotal] = useState<number | null>(null)

  useEffect(() => {
    if (!activeCustomerEmail || !accessToken) {
      rememberPostLoginRedirect()
      showAuthToastOnce("Please sign in to continue checkout.")
      navigate("/user", { replace: true })
    }
  }, [activeCustomerEmail, accessToken, navigate])

  useEffect(() => {
    if (!activeCustomer) return
    setReceiverName(activeCustomer.profile.fullName)
    setReceiverPhone(activeCustomer.profile.phone)
    setShippingAddress(activeCustomer.profile.address)
  }, [activeCustomer])

  const availablePoints = activeCustomer?.loyaltyPoints ?? 0
  const appliedVoucher = getVoucherByCode(appliedVoucherCode)

  const {
    items,
    subtotal,
    tax,
    shippingFee,
    voucherDiscount,
    pointsDiscount,
    total,
    normalizedPoints,
    canUsePoints,
  } = useMemo(
    () =>
      calculateOrderSummary({
        cartItems,
        products,
        getProductPricing,
        shippingMethod,
        settings,
        appliedVoucher,
        pointsToUse,
        availablePoints,
      }),
    [
      cartItems,
      products,
      getProductPricing,
      shippingMethod,
      settings,
      appliedVoucher,
      pointsToUse,
      availablePoints,
    ]
  )

  const finalizeOrder = async (input: {
    paymentMethod: "paypal"
    paypalOrderId?: string
    successMessage?: string
    lockedTotal?: number
  }) => {
    const result = await placeOrder({
      receiverName,
      receiverPhone,
      shippingAddress,
      shippingMethod,
      note,
      voucherCode: appliedVoucherCode,
      pointsToUse: normalizedPoints,
      paymentMethod: input.paymentMethod,
      paypalOrderId: input.paypalOrderId,
      lockedTotal: input.lockedTotal,
    })

    if (result.ok) {
      toast.success(input.successMessage ?? result.message)
      setCompletedOrderCode(result.orderCode ?? "")
      setAppliedVoucherCode("")
      setVoucherInput("")
      setPointsToUse("0")
      return
    }

    toast.error(result.message)
  }

  const applyVoucherCode = () => {
    const voucher = getVoucherByCode(voucherInput)
    if (!voucher) {
      toast.error("Voucher invalid.")
      return
    }

    setAppliedVoucherCode(voucher.code)
    toast.success(`Voucher ${voucher.code} validated.`)
  }

  const createPayPalOrder = (_data: unknown, actions: any) => {
    const quoted = Number(total.toFixed(2))
    setPaypalQuotedTotal(quoted)

    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: "USD", value: quoted.toFixed(2) } }],
    })
  }

  const handlePayPalApprove = async (_data: unknown, actions: any) => {
    setIsSubmitting(true)
    try {
      const capture = await actions.order?.capture()
      if (capture?.id) {
        const capturedAmountRaw = capture?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value
          ?? capture?.purchase_units?.[0]?.amount?.value
        const capturedAmount = Number(capturedAmountRaw)

        await finalizeOrder({
          paymentMethod: "paypal",
          paypalOrderId: capture.id,
          lockedTotal:
            Number.isFinite(capturedAmount) && capturedAmount > 0
              ? capturedAmount
              : paypalQuotedTotal ?? Number(total.toFixed(2)),
          successMessage: "Financial orchestraton successful. Signature captured.",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!activeCustomerEmail || !accessToken) {
    return null
  }

  if (completedOrderCode) {
    return <OrderCompletedState completedOrderCode={completedOrderCode} onGoPortfolio={() => navigate("/user")} />
  }

  return (
    <div className="relative mx-auto w-full max-w-[1400px] space-y-6 px-3 pb-24 pt-4 md:mt-10 md:space-y-20 md:px-12 md:pt-10">
      <header className="space-y-2 border-b border-border pb-5 md:space-y-4 md:pb-10">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-accent md:text-[10px] md:font-bold md:tracking-widest">Curatorial Verification</p>
        <h1 className="text-3xl font-semibold leading-none tracking-tight text-foreground md:font-serif md:text-7xl md:tracking-tighter lg:text-8xl">
          Signature & <br /><span className="italic text-accent opacity-90">Confirmation</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-20">
        <div className="space-y-8 pt-1 md:space-y-20 md:pt-2">
          <CollectorIdentitySection
            receiverName={receiverName}
            onReceiverNameChange={setReceiverName}
            receiverPhone={receiverPhone}
            onReceiverPhoneChange={setReceiverPhone}
            shippingMethod={shippingMethod}
            onShippingMethodChange={setShippingMethod}
            shippingAddress={shippingAddress}
            onShippingAddressChange={setShippingAddress}
            note={note}
            onNoteChange={setNote}
            settings={settings}
          />

          <FinancialFrameworkSection
            voucherInput={voucherInput}
            onVoucherInputChange={setVoucherInput}
            onApplyVoucher={applyVoucherCode}
            appliedVoucherAmount={appliedVoucher?.discountAmount ?? null}
            availablePoints={availablePoints}
            pointsToUse={pointsToUse}
            onPointsToUseChange={setPointsToUse}
            canUsePoints={canUsePoints}
            dollarsPerPoint={settings.dollarsPerPoint}
            formatUsd={formatUsd}
          />
        </div>

        <OrderSummaryAside
          items={items}
          subtotal={subtotal}
          shippingMethod={shippingMethod}
          shippingFee={shippingFee}
          tax={tax}
          voucherDiscount={voucherDiscount}
          pointsDiscount={pointsDiscount}
          total={total}
          isSubmitting={isSubmitting}
          formatUsd={formatUsd}
          createPayPalOrder={createPayPalOrder}
          handlePayPalApprove={handlePayPalApprove}
        />
      </div>
    </div>
  )
}

export default ConfirmOrderPage
