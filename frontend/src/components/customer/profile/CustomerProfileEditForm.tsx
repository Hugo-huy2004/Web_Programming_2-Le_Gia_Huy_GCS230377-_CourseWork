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
      className="mx-auto w-full max-w-2xl rounded-sm border border-border bg-white p-3 shadow-editorial md:p-16"
    >
      <div className="mb-4 space-y-2 text-center md:mb-12 md:space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-accent md:small-caps">Registry Refinement</p>
        <h3 className="text-xl font-semibold text-foreground md:font-serif md:text-4xl md:italic md:tracking-tighter">Update Profile</h3>
        <div className="mx-auto mt-2 h-px w-12 bg-border md:mt-4 md:w-16" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 md:gap-10">
        <div className="grid gap-1.5 md:gap-3">
          <label className="text-[10px] font-medium text-muted-foreground md:small-caps">Legal Name</label>
          <input
            id="edit-full-name"
            className="flex h-10 w-full rounded-sm border border-border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:h-12 md:bg-transparent md:text-lg md:font-serif"
            value={profileForm.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
          />
        </div>

        <div className="grid gap-1.5 md:gap-3">
          <label className="text-[10px] font-medium text-muted-foreground md:small-caps">Birth Registry</label>
          <input
            id="edit-birthday"
            type="date"
            className="flex h-10 w-full rounded-sm border border-border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:h-12 md:bg-transparent md:font-serif"
            value={profileForm.birthday}
            onChange={(event) => updateField("birthday", event.target.value)}
          />
        </div>

        <div className="grid gap-1.5 md:gap-3">
          <label className="text-[10px] font-medium text-muted-foreground md:small-caps">Direct Connection</label>
          <input
            id="edit-phone"
            className="flex h-10 w-full rounded-sm border border-border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:h-12 md:bg-transparent md:text-lg md:font-serif"
            value={profileForm.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </div>

        <div className="grid gap-1.5 md:col-span-2 md:gap-3">
          <label className="text-[10px] font-medium text-muted-foreground md:small-caps">Primary Residence</label>
          <Textarea
            id="edit-address"
            rows={2}
            className="min-h-[90px] resize-none rounded-sm border border-border bg-transparent p-3 text-sm focus-visible:border-accent md:min-h-[100px] md:p-4 md:text-lg md:font-serif"
            value={profileForm.address}
            onChange={(event) => updateField("address", event.target.value)}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center justify-center gap-2 border-t border-border pt-4 sm:flex-row sm:gap-8 md:mt-12 md:pt-10">
        <button
          onClick={onSave}
          className="w-full rounded-sm bg-foreground px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-background shadow-sm transition-all duration-300 hover:bg-accent hover:text-white sm:w-auto sm:px-12 sm:py-4 sm:text-[11px] sm:font-bold sm:tracking-[0.24em] sm:duration-700"
        >
          Commit Changes
        </button>
        <button
          onClick={onCancel}
          className="w-full py-2 text-[10px] font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground sm:w-auto sm:small-caps sm:duration-500"
        >
          Retract
        </button>
      </div>
    </motion.div>
  )
}
