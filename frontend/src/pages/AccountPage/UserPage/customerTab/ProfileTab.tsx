import { useMemo, useState } from "react"
import { toast } from "sonner"
import { CustomerProfileTab } from "@/components/customer/tabs/CustomerProfileTab"
import type { ProfileForm, CustomerAccount } from "@/types/store"
import { useCustomerStore } from "@/stores/useCustomerStore"
import { formatUsd } from "@/lib/formatUtils"

function validateProfileForm(profile: ProfileForm): Partial<ProfileForm> {
  const errors: Partial<ProfileForm> = {}

  if (!profile.fullName.trim()) errors.fullName = "Full name is required."
  if (!profile.birthday) errors.birthday = "Birthday is required."
  if (!profile.phone.trim()) errors.phone = "Phone number is required."
  if (!profile.address.trim()) errors.address = "Address is required."

  return errors
}

export function ProfileTab() {
  const { activeCustomerEmail, activeCustomer, customers, updateCustomerProfile, customerLogout } = useCustomerStore()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editProfileForm, setEditProfileForm] = useState<ProfileForm>({
    fullName: "",
    birthday: "",
    phone: "",
    address: "",
  })
  const [, setEditProfileErrors] = useState<Partial<ProfileForm>>({})

  const resolvedActiveCustomer = useMemo<CustomerAccount | null>(() => {
    if (activeCustomer) return activeCustomer
    if (!activeCustomerEmail) return null
    return customers.find((customer) => customer.email === activeCustomerEmail) ?? null
  }, [activeCustomer, activeCustomerEmail, customers])

  const beginProfileEdit = () => {
    if (!resolvedActiveCustomer) return

    setEditProfileForm({
      fullName: resolvedActiveCustomer.profile.fullName,
      birthday: resolvedActiveCustomer.profile.birthday,
      phone: resolvedActiveCustomer.profile.phone,
      address: resolvedActiveCustomer.profile.address,
    })
    setEditProfileErrors({})
    setIsEditingProfile(true)
  }

  const submitProfileUpdate = async () => {
    const errors = validateProfileForm(editProfileForm)

    if (Object.keys(errors).length > 0) {
      setEditProfileErrors(errors)
      toast.error("Please refine your registry details.")
      return
    }

    const result = await updateCustomerProfile({
      fullName: editProfileForm.fullName,
      birthday: editProfileForm.birthday,
      phone: editProfileForm.phone,
      address: editProfileForm.address,
    })

    if (result.ok) {
      setIsEditingProfile(false)
      setEditProfileErrors({})
      toast.success("Identity Registry Refined Successfully")
      return
    }
    toast.error(result.message)
  }

  return (
    <CustomerProfileTab
      activeCustomer={resolvedActiveCustomer}
      isEditingProfile={isEditingProfile}
      setIsEditingProfile={setIsEditingProfile}
      editProfileForm={editProfileForm}
      setEditProfileForm={setEditProfileForm}
      setEditProfileErrors={setEditProfileErrors}
      handleStartEditProfile={beginProfileEdit}
      handleSaveEditedProfile={submitProfileUpdate}
      customerLogout={customerLogout}
      formatUsd={formatUsd}
    />
  )
}
