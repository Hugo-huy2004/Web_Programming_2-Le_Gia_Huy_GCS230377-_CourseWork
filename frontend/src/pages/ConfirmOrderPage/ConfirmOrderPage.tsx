import {
  CollectorIdentitySection
} from "@/components/order/CollectorIdentitySection"
import {
  FinancialFrameworkSection
} from "@/components/order/FinancialFrameworkSection"
import {
  IdentificationRequiredState,
  OrderCompletedState
} from "@/components/order/ConfirmOrderStates"
import {
  OrderSummaryAside
} from "@/components/order/OrderSummaryAside"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useCartStore } from "@/stores/useCartStore"
import { useProductStore } from "@/stores/useProductStore"
import { useCustomerStore } from "@/stores/useCustomerStore"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { useVoucherStore } from "@/stores/useVoucherStore"
import { useOrderStore } from "@/stores/useOrderStore"
import { calculateOrderSummary } from "@/lib/orderCalculations"
import { formatUsd } from "@/lib/formatUtils"
import type { ShippingMethod } from "@/types/store"

const ConfirmOrderPage = () => {
  const navigate = useNavigate()
  const { cartItems } = useCartStore()
  const { products, getProductPricing } = useProductStore()
  const { activeCustomer, activeCustomerEmail } = useCustomerStore()
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

  const createPayPalOrder = (_data: unknown, actions: any) =>
    actions.order.create({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: "USD", value: total.toFixed(2) } }],
    })

  const handlePayPalApprove = async (_data: unknown, actions: any) => {
    setIsSubmitting(true)
    try {
      const capture = await actions.order?.capture()
      if (capture?.id) {
        await finalizeOrder({
          paymentMethod: "paypal",
          paypalOrderId: capture.id,
          successMessage: "Financial orchestraton successful. Signature captured.",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!activeCustomerEmail) {
    return <IdentificationRequiredState />
  }

  if (completedOrderCode) {
    return <OrderCompletedState completedOrderCode={completedOrderCode} onGoPortfolio={() => navigate("/user")} />
  }

  return (
    <div className="relative space-y-12 md:space-y-20 pb-24 mt-10 mx-auto w-full max-w-[1400px] px-6 md:px-12 pt-6 md:pt-10">
      <header className="border-b border-border pb-10 space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Curatorial Verification</p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground tracking-tighter leading-none">
          Signature & <br /><span className="italic text-accent opacity-90">Confirmation</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-20">
        <div className="space-y-20 pt-2">
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
            minimumPointsToRedeem={settings.minimumPointsToRedeem}
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
