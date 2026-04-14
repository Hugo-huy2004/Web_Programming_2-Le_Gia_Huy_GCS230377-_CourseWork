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
        <div className="space-y-8 md:space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Membership Tier",
                value: getMembershipLabel(activeCustomer.totalSpent),
                sub: getMembershipSubLabel(activeCustomer.totalSpent),
              },
              { label: "Accumulated Reserves", value: `${activeCustomer.loyaltyPoints} Points`, sub: "Loyalty Capital" },
              { label: "Portfolio Valuation", value: formatUsd(activeCustomer.totalSpent), sub: "Total Investment" },
            ].map((stat, i) => (
              <div key={i} className="p-5 md:p-8 bg-white border border-border rounded-sm shadow-sm hover:shadow-editorial transition-all duration-500 group">
                <p className="small-caps text-[9px] text-muted-foreground group-hover:text-accent transition-colors">{stat.label}</p>
                <p className="font-serif text-xl md:text-3xl italic text-foreground mt-2 break-words">{stat.value}</p>
                <p className="text-[10px] font-serif italic text-muted-foreground/60 mt-2">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="p-5 md:p-12 bg-white border border-border rounded-sm shadow-sm h-full">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-8 md:mb-10">
                  <div className="space-y-1">
                    <p className="small-caps text-accent">Registry Manifest</p>
                    <h3 className="font-serif text-xl md:text-2xl italic">Collector Profile</h3>
                  </div>
                  <button
                    onClick={handleStartEditProfile}
                    className="w-full sm:w-auto px-5 py-2 border border-border rounded-sm text-[9px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-500"
                  >
                    Edit Registry
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 font-serif">
                  <div className="space-y-1">
                    <p className="small-caps text-[8px] text-muted-foreground/40">Legal Full Name</p>
                    <p className="text-base md:text-lg italic text-foreground border-b border-border/40 pb-2">{activeCustomer.profile.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="small-caps text-[8px] text-muted-foreground/40">Birth Registry</p>
                    <p className="text-base md:text-lg italic text-foreground border-b border-border/40 pb-2">{activeCustomer.profile.birthday || "Unregistered"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="small-caps text-[8px] text-muted-foreground/40">Communication Line</p>
                    <p className="text-base md:text-lg italic text-foreground border-b border-border/40 pb-2">{activeCustomer.profile.phone || "Unlinked"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="small-caps text-[8px] text-muted-foreground/40">Registry ID</p>
                    <p className="text-base md:text-lg italic text-foreground border-b border-border/40 pb-2 break-all">HWJ-{activeCustomer.email.split("@")[0].slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <p className="small-caps text-[8px] text-muted-foreground/40">Permanent Residence</p>
                    <p className="text-sm italic text-muted-foreground leading-relaxed pt-1">{activeCustomer.profile.address || "Undisclosed Geographic Anchor"}</p>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-border/40 flex justify-end">
                  <button
                    onClick={customerLogout}
                    className="text-[9px] font-bold uppercase tracking-[0.2em] text-destructive/60 hover:text-destructive transition-colors flex items-center gap-2"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="p-5 md:p-12 bg-secondary/30 border border-border rounded-sm h-full">
                <div className="space-y-1 mb-8 md:mb-10">
                  <p className="small-caps text-muted-foreground">Status Eligibility</p>
                  <h3 className="font-serif text-xl md:text-2xl italic">Tier Privileges</h3>
                </div>

                <div className="space-y-6">
                  {privilegeRows.map((p, i) => (
                    <div key={i} className={`p-4 rounded-sm border transition-all duration-500 ${p.active ? "border-accent bg-white shadow-sm" : "border-border/40 opacity-30 grayscale"}`}>
                      <div className="flex justify-between items-center mb-1">
                        <p className="small-caps text-[10px]">{p.label} Protocol</p>
                        {p.active && <div className="h-1 w-1 bg-accent rounded-full" />}
                      </div>
                      <p className="text-[11px] font-serif italic text-muted-foreground leading-relaxed">{p.desc}</p>
                    </div>
                  ))}

                  <div className="pt-6 border-t border-border/40">
                    <p className="small-caps text-[9px] text-muted-foreground mb-4">Capital Progression</p>
                    <div className="h-1 w-full bg-border/20 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${getProgressPercent(activeCustomer.totalSpent)}%` }} className="h-full bg-accent" />
                    </div>
                    <p className="text-[9px] font-serif italic text-muted-foreground mt-3 text-right">
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
