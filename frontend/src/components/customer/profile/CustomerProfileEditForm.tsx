import { motion } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import type { ProfileForm } from "@/types/store"
import type { Dispatch, SetStateAction } from "react"

type CustomerProfileEditFormProps = {
  profileForm: ProfileForm
  setProfileForm: Dispatch<SetStateAction<ProfileForm>>
  onSave: () => Promise<void>
  onCancel: () => void
}

export function CustomerProfileEditForm({
  profileForm,
  setProfileForm,
  onSave,
  onCancel,
}: CustomerProfileEditFormProps) {
  const updateField = (field: keyof ProfileForm, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl border border-border bg-white p-5 md:p-16 rounded-sm shadow-editorial mx-auto"
    >
      <div className="mb-8 md:mb-12 space-y-4 text-center">
        <p className="small-caps text-accent">Registry Refinement</p>
        <h3 className="font-serif text-2xl md:text-4xl text-foreground tracking-tighter italic">Update Profile</h3>
        <div className="h-px w-16 bg-border mx-auto mt-4" />
      </div>

      <div className="grid gap-6 md:gap-10 md:grid-cols-2">
        <div className="grid gap-3">
          <label className="small-caps text-[10px]">Legal Name</label>
          <input
            id="edit-full-name"
            className="flex h-11 md:h-12 w-full px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-border bg-transparent focus-visible:border-accent rounded-sm text-base md:text-lg font-serif border"
            value={profileForm.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <label className="small-caps text-[10px]">Birth Registry</label>
          <input
            id="edit-birthday"
            type="date"
            className="flex h-12 w-full px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-border bg-transparent focus-visible:border-accent rounded-sm font-serif text-sm border"
            value={profileForm.birthday}
            onChange={(event) => updateField("birthday", event.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <label className="small-caps text-[10px]">Direct Connection</label>
          <input
            id="edit-phone"
            className="flex h-11 md:h-12 w-full px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-border bg-transparent focus-visible:border-accent rounded-sm text-base md:text-lg font-serif border"
            value={profileForm.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </div>

        <div className="grid gap-3 md:col-span-2">
          <label className="small-caps text-[10px]">Primary Residence</label>
          <Textarea
            id="edit-address"
            rows={2}
            className="min-h-[100px] border-border bg-transparent focus-visible:border-accent rounded-sm p-4 text-lg font-serif resize-none"
            value={profileForm.address}
            onChange={(event) => updateField("address", event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 mt-8 md:mt-12 pt-6 md:pt-10 border-t border-border">
        <button
          onClick={onSave}
          className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-foreground text-background text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.24em] rounded-sm hover:bg-accent hover:text-white transition-all duration-700 shadow-sm"
        >
          Commit Changes
        </button>
        <button
          onClick={onCancel}
          className="w-full sm:w-auto small-caps text-[10px] text-muted-foreground hover:text-foreground transition-colors duration-500 py-2"
        >
          Retract
        </button>
      </div>
    </motion.div>
  )
}
