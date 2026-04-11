import React from "react"
import { Textarea } from "../../../../components/ui/textarea"
import { motion } from "framer-motion"
import type { ProfileForm, CustomerAccount } from "../../../../types/store"
 
interface ProfileSectionProps {
  activeCustomer: CustomerAccount | null
  isEditingProfile: boolean
  setIsEditingProfile: (val: boolean) => void
  editProfileForm: ProfileForm
  setEditProfileForm: React.Dispatch<React.SetStateAction<ProfileForm>>
  editProfileErrors: Partial<ProfileForm>
  setEditProfileErrors: React.Dispatch<React.SetStateAction<Partial<ProfileForm>>>
  handleStartEditProfile: () => void
  handleSaveEditedProfile: () => Promise<void>
  customerLogout: () => void
  formatUsd: (val: number) => string
}
 
export const ProfileSection = ({
  activeCustomer,
  isEditingProfile,
  setIsEditingProfile,
  editProfileForm,
  setEditProfileForm,
  editProfileErrors,
  setEditProfileErrors,
  handleStartEditProfile,
  handleSaveEditedProfile,
  customerLogout,
  formatUsd
}: ProfileSectionProps) => {
  if (!activeCustomer) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="rounded-sm border border-border bg-white p-8 md:p-12 shadow-sm">
          <p className="small-caps text-accent">Identity Registry</p>
          <h3 className="mt-2 font-serif text-2xl italic text-foreground">Profile Not Available</h3>
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
        <div className="space-y-12">
          
          {/* Account Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Membership Tier", value: activeCustomer.totalSpent >= 20000 ? "Diamond Elite" : activeCustomer.totalSpent >= 5000 ? "Gold Collector" : "Silver Member", sub: activeCustomer.totalSpent >= 20000 ? "Elite Status" : activeCustomer.totalSpent >= 5000 ? "Active Tier" : "Entry Tier" },
              { label: "Accumulated Reserves", value: `${activeCustomer.loyaltyPoints} Points`, sub: "Loyalty Capital" },
              { label: "Portfolio Valuation", value: formatUsd(activeCustomer.totalSpent), sub: "Total Investment" }
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-white border border-border rounded-sm shadow-sm hover:shadow-editorial transition-all duration-500 group">
                <p className="small-caps text-[9px] text-muted-foreground group-hover:text-accent transition-colors">{stat.label}</p>
                <p className="font-serif text-2xl md:text-3xl italic text-foreground mt-2">{stat.value}</p>
                <p className="text-[10px] font-serif italic text-muted-foreground/60 mt-2">{stat.sub}</p>
              </div>
            ))}
          </div>
 
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Identity Information Card */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-8 md:p-12 bg-white border border-border rounded-sm shadow-sm h-full">
                <div className="flex justify-between items-start mb-10">
                  <div className="space-y-1">
                    <p className="small-caps text-accent">Registry Manifest</p>
                    <h3 className="font-serif text-2xl italic">Collector Profile</h3>
                  </div>
                  <button
                    onClick={handleStartEditProfile}
                    className="px-6 py-2 border border-border rounded-sm text-[9px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-500"
                  >
                    Edit Registry
                  </button>
                </div>
 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 font-serif">
                  <div className="space-y-1">
                    <p className="small-caps text-[8px] text-muted-foreground/40">Legal Full Name</p>
                    <p className="text-lg italic text-foreground border-b border-border/40 pb-2">{activeCustomer.profile.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="small-caps text-[8px] text-muted-foreground/40">Birth Registry</p>
                    <p className="text-lg italic text-foreground border-b border-border/40 pb-2">{activeCustomer.profile.birthday || "Unregistered"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="small-caps text-[8px] text-muted-foreground/40">Communication Line</p>
                    <p className="text-lg italic text-foreground border-b border-border/40 pb-2">{activeCustomer.profile.phone || "Unlinked"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="small-caps text-[8px] text-muted-foreground/40">Registry ID</p>
                    <p className="text-lg italic text-foreground border-b border-border/40 pb-2">HWJ-{activeCustomer.email.split('@')[0].slice(0, 8).toUpperCase()}</p>
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
 
            {/* Tier Privileges Status */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 md:p-12 bg-secondary/30 border border-border rounded-sm h-full">
                <div className="space-y-1 mb-10">
                  <p className="small-caps text-muted-foreground">Status Eligibility</p>
                  <h3 className="font-serif text-2xl italic">Tier Privileges</h3>
                </div>
 
                <div className="space-y-6">
                  {[
                    { label: "Silver", desc: "Basic acquisition ledger & maintenance registry.", active: activeCustomer.totalSpent < 5000 },
                    { label: "Gold", desc: "Priority routing, restoration & preview access.", active: activeCustomer.totalSpent >= 5000 && activeCustomer.totalSpent < 20000 },
                    { label: "Diamond", desc: "Private advisor & Bespoke orchestration.", active: activeCustomer.totalSpent >= 20000 }
                  ].map((p, i) => (
                    <div key={i} className={`p-4 rounded-sm border transition-all duration-500 ${p.active ? 'border-accent bg-white shadow-sm' : 'border-border/40 opacity-30 grayscale'}`}>
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
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (activeCustomer.totalSpent / (activeCustomer.totalSpent >= 5000 ? 20000 : 5000)) * 100)}%` }}
                        className="h-full bg-accent"
                      />
                    </div>
                    <p className="text-[9px] font-serif italic text-muted-foreground mt-3 text-right">
                       {activeCustomer.totalSpent >= 20000 ? 'Maximum Tier Attained' : activeCustomer.totalSpent >= 5000 ? formatUsd(20000 - activeCustomer.totalSpent) + ' until Diamond Elevation' : formatUsd(5000 - activeCustomer.totalSpent) + ' until Gold Elevation'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl border border-border bg-white p-10 md:p-16 rounded-sm shadow-editorial mx-auto"
        >
          <div className="mb-12 space-y-4 text-center">
            <p className="small-caps text-accent">Registry Refinement</p>
            <h3 className="font-serif text-4xl text-foreground tracking-tighter italic">Update Profile</h3>
            <div className="h-px w-16 bg-border mx-auto mt-4" />
          </div>
 
          <div className="grid gap-10 md:grid-cols-2">
            <div className="grid gap-3">
              <label className="small-caps text-[10px]">Legal Name</label>
              <input
                id="edit-full-name"
                className="flex h-12 w-full px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-border bg-transparent focus-visible:border-accent rounded-sm text-lg font-serif border"
                value={editProfileForm.fullName}
                onChange={(event) =>
                  setEditProfileForm((prev) => ({ ...prev, fullName: event.target.value }))
                }
              />
              {editProfileErrors.fullName && (
                <p className="text-[11px] text-destructive font-serif italic">{editProfileErrors.fullName}</p>
              )}
            </div>
 
            <div className="grid gap-3">
              <label className="small-caps text-[10px]">Birth Registry</label>
              <input
                id="edit-birthday"
                type="date"
                className="flex h-12 w-full px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-border bg-transparent focus-visible:border-accent rounded-sm font-serif text-sm border"
                value={editProfileForm.birthday}
                onChange={(event) =>
                  setEditProfileForm((prev) => ({ ...prev, birthday: event.target.value }))
                }
              />
              {editProfileErrors.birthday && (
                <p className="text-[11px] text-destructive font-serif italic">{editProfileErrors.birthday}</p>
              )}
            </div>
 
            <div className="grid gap-3">
              <label className="small-caps text-[10px]">Direct Connection</label>
              <input
                id="edit-phone"
                className="flex h-12 w-full px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-border bg-transparent focus-visible:border-accent rounded-sm text-lg font-serif border"
                value={editProfileForm.phone}
                onChange={(event) =>
                  setEditProfileForm((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
              {editProfileErrors.phone && (
                <p className="text-[11px] text-destructive font-serif italic">{editProfileErrors.phone}</p>
              )}
            </div>
 
            <div className="grid gap-3 md:col-span-2">
              <label className="small-caps text-[10px]">Primary Residence</label>
              <Textarea
                id="edit-address"
                rows={2}
                className="min-h-[100px] border-border bg-transparent focus-visible:border-accent rounded-sm p-4 text-lg font-serif resize-none"
                value={editProfileForm.address}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setEditProfileForm((prev) => ({ ...prev, address: event.target.value }))
                }
              />
              {editProfileErrors.address && (
                <p className="text-[11px] text-destructive font-serif italic">{editProfileErrors.address}</p>
              )}
            </div>
          </div>
 
          <div className="flex items-center justify-center gap-8 mt-12 pt-10 border-t border-border">
            <button
              onClick={handleSaveEditedProfile}
              className="px-12 py-4 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.24em] rounded-sm hover:bg-accent hover:text-white transition-all duration-700 shadow-sm"
            >
              Commit Changes
            </button>
            <button
              onClick={() => {
                setIsEditingProfile(false)
                setEditProfileErrors({})
              }}
              className="small-caps text-[10px] text-muted-foreground hover:text-foreground transition-colors duration-500"
            >
              Retract
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
