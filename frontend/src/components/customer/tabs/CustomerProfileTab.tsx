import React from "react"
import { motion } from "framer-motion"
import type { ProfileForm, CustomerAccount } from "@/types/store"
import { CustomerProfileEditForm } from "@/components/customer/profile/CustomerProfileEditForm"

interface CustomerProfileTabProps {
  activeCustomer: CustomerAccount | null
  isEditingProfile: boolean
  setIsEditingProfile: (val: boolean) => void
  editProfileForm: ProfileForm
  setEditProfileForm: React.Dispatch<React.SetStateAction<ProfileForm>>
  setEditProfileErrors: React.Dispatch<React.SetStateAction<Partial<ProfileForm>>>
  handleStartEditProfile: () => void
  handleSaveEditedProfile: () => Promise<void>
  customerLogout: () => void
  formatUsd: (val: number) => string
}

function getMembershipLabel(totalSpent: number): string {
  if (totalSpent >= 20000) return "Diamond Elite"
  if (totalSpent >= 5000) return "Gold Collector"
  return "Silver Member"
}

function getMembershipSubLabel(totalSpent: number): string {
  if (totalSpent >= 20000) return "Elite Status"
  if (totalSpent >= 5000) return "Active Tier"
  return "Entry Tier"
}

function getProgressPercent(totalSpent: number): number {
  const target = totalSpent >= 5000 ? 20000 : 5000
  return Math.min(100, (totalSpent / target) * 100)
}

function getProgressLabel(totalSpent: number, formatUsd: (val: number) => string): string {
  if (totalSpent >= 20000) return "Maximum Tier Attained"
  if (totalSpent >= 5000) return `${formatUsd(20000 - totalSpent)} until Diamond Elevation`
  return `${formatUsd(5000 - totalSpent)} until Gold Elevation`
}

function getPrivilegeRows(totalSpent: number) {
  return [
    {
      label: "Silver",
      desc: "Basic acquisition ledger & maintenance registry.",
      active: totalSpent < 5000,
    },
    {
      label: "Gold",
      desc: "Priority routing, restoration & preview access.",
      active: totalSpent >= 5000 && totalSpent < 20000,
    },
    {
      label: "Diamond",
      desc: "Private advisor & Bespoke orchestration.",
      active: totalSpent >= 20000,
    },
  ]
}

export function CustomerProfileTab({
  activeCustomer,
  isEditingProfile,
  setIsEditingProfile,
  editProfileForm,
  setEditProfileForm,
  setEditProfileErrors,
  handleStartEditProfile,
  handleSaveEditedProfile,
  customerLogout,
  formatUsd,
}: CustomerProfileTabProps) {
  const privilegeRows = activeCustomer ? getPrivilegeRows(activeCustomer.totalSpent) : []

  if (!activeCustomer) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="rounded-sm border border-border bg-white p-5 md:p-12 shadow-sm">
          <p className="small-caps text-accent">Identity Registry</p>
          <h3 className="mt-2 font-serif text-xl italic text-foreground md:text-2xl">Profile Not Available</h3>
          <p className="mt-4 text-sm font-serif italic text-muted-foreground leading-relaxed">
            Your registry profile is not loaded yet. Please re-login with Google to re-sync your customer identity.
          </p>
          <button
            onClick={customerLogout}
            className="mt-6 rounded-sm border border-border px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 hover:bg-foreground hover:text-background"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {!isEditingProfile ? (
        <div className="space-y-4 md:space-y-12">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6">
            {[
              {
                label: "Membership Tier",
                value: getMembershipLabel(activeCustomer.totalSpent),
                sub: getMembershipSubLabel(activeCustomer.totalSpent),
              },
              { label: "Accumulated Reserves", value: `${activeCustomer.loyaltyPoints} Points`, sub: "Loyalty Capital" },
              { label: "Portfolio Valuation", value: formatUsd(activeCustomer.totalSpent), sub: "Total Investment" },
            ].map((stat, i) => (
              <div key={i} className="group rounded-sm border border-border bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-editorial md:p-8 md:duration-500">
                <p className="text-[10px] font-medium text-muted-foreground transition-colors group-hover:text-accent md:small-caps md:text-[9px]">{stat.label}</p>
                <p className="mt-1 break-words text-lg font-semibold text-foreground md:mt-2 md:font-serif md:text-3xl md:italic">{stat.value}</p>
                <p className="mt-1 text-[10px] text-muted-foreground/70 md:mt-2 md:font-serif md:italic md:text-[10px]">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-10">
            <div className="space-y-4 lg:col-span-7 lg:space-y-6">
              <div className="h-full rounded-sm border border-border bg-white p-3 shadow-sm md:p-12">
                <div className="mb-4 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-start sm:justify-between md:mb-10 md:gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-accent md:small-caps">Registry Manifest</p>
                    <h3 className="text-lg font-semibold md:font-serif md:text-2xl md:italic">Collector Profile</h3>
                  </div>
                  <button
                    onClick={handleStartEditProfile}
                    className="w-full rounded-sm border border-border px-4 py-2 text-[10px] font-semibold transition-all duration-300 hover:bg-foreground hover:text-background sm:w-auto md:px-5 md:text-[9px] md:font-bold md:uppercase md:tracking-widest md:duration-500"
                  >
                    Edit Registry
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 md:gap-y-8 md:font-serif">
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-muted-foreground/60 md:small-caps md:text-[8px]">Legal Full Name</p>
                    <p className="border-b border-border/40 pb-1 text-sm text-foreground md:pb-2 md:text-lg md:italic">{activeCustomer.profile.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-muted-foreground/60 md:small-caps md:text-[8px]">Birth Registry</p>
                    <p className="border-b border-border/40 pb-1 text-sm text-foreground md:pb-2 md:text-lg md:italic">{activeCustomer.profile.birthday || "Unregistered"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-muted-foreground/60 md:small-caps md:text-[8px]">Communication Line</p>
                    <p className="border-b border-border/40 pb-1 text-sm text-foreground md:pb-2 md:text-lg md:italic">{activeCustomer.profile.phone || "Unlinked"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-muted-foreground/60 md:small-caps md:text-[8px]">Registry ID</p>
                    <p className="break-all border-b border-border/40 pb-1 text-sm text-foreground md:pb-2 md:text-lg md:italic">HWJ-{activeCustomer.email.split("@")[0].slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <p className="text-[10px] font-medium text-muted-foreground/60 md:small-caps md:text-[8px]">Permanent Residence</p>
                    <p className="pt-1 text-sm leading-relaxed text-muted-foreground md:italic">{activeCustomer.profile.address || "Undisclosed Geographic Anchor"}</p>
                  </div>
                </div>

                <div className="mt-5 flex justify-end border-t border-border/40 pt-4 md:mt-10 md:pt-8">
                  <button
                    onClick={customerLogout}
                    className="flex items-center gap-2 text-[10px] font-semibold text-destructive/70 transition-colors hover:text-destructive md:text-[9px] md:font-bold md:uppercase md:tracking-[0.2em]"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-5 lg:space-y-6">
              <div className="h-full rounded-sm border border-border bg-secondary/30 p-3 md:p-12">
                <div className="mb-4 space-y-1 md:mb-10">
                  <p className="text-[10px] font-medium text-muted-foreground md:small-caps">Status Eligibility</p>
                  <h3 className="text-lg font-semibold md:font-serif md:text-2xl md:italic">Tier Privileges</h3>
                </div>

                <div className="space-y-3 md:space-y-6">
                  {privilegeRows.map((p, i) => (
                    <div key={i} className={`rounded-sm border p-3 transition-all duration-300 md:p-4 md:duration-500 ${p.active ? "border-accent bg-white shadow-sm" : "border-border/40 opacity-40"}`}>
                      <div className="mb-1 flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] md:small-caps">{p.label} Protocol</p>
                        {p.active && <div className="h-1 w-1 bg-accent rounded-full" />}
                      </div>
                      <p className="text-[11px] leading-relaxed text-muted-foreground md:font-serif md:italic">{p.desc}</p>
                    </div>
                  ))}

                  <div className="border-t border-border/40 pt-4 md:pt-6">
                    <p className="mb-3 text-[10px] font-medium text-muted-foreground md:small-caps md:text-[9px] md:mb-4">Capital Progression</p>
                    <div className="h-1 w-full bg-border/20 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${getProgressPercent(activeCustomer.totalSpent)}%` }} className="h-full bg-accent" />
                    </div>
                    <p className="mt-2 text-right text-[10px] text-muted-foreground md:mt-3 md:font-serif md:italic md:text-[9px]">
                      {getProgressLabel(activeCustomer.totalSpent, formatUsd)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CustomerProfileEditForm
          profileForm={editProfileForm}
          setProfileForm={setEditProfileForm}
          onSave={handleSaveEditedProfile}
          onCancel={() => {
            setIsEditingProfile(false)
            setEditProfileErrors({})
          }}
        />
      )}
    </div>
  )
}
