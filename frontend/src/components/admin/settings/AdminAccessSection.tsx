import { Shield, UserPlus } from "lucide-react"
import type { AdminAccount } from "@/types/store"

type AdminAccessSectionProps = {
  admins: AdminAccount[]
  newAdminUsername: string
  onNewAdminUsernameChange: (value: string) => void
  newAdminPassword: string
  onNewAdminPasswordChange: (value: string) => void
  onAddAdmin: () => void
}

export function AdminAccessSection({
  admins,
  newAdminUsername,
  onNewAdminUsernameChange,
  newAdminPassword,
  onNewAdminPasswordChange,
  onAddAdmin,
}: AdminAccessSectionProps) {
  return (
    <section className="space-y-12">
      <div className="border-b border-border/40 pb-8">
        <p className="mb-3 small-caps text-[10px] font-medium tracking-[0.2em] text-accent">Personnel Registry</p>
        <h2 className="font-serif text-4xl italic tracking-tight text-foreground">Administrative Access</h2>
      </div>

      <div className="grid grid-cols-1 items-end gap-12 rounded-sm bg-foreground p-12 text-background shadow-editorial md:grid-cols-3">
        <div className="space-y-4">
          <label className="small-caps text-[9px] font-bold tracking-[0.2em] text-background/40">
            Credential: Principal Username
          </label>
          <input
            type="text"
            value={newAdminUsername}
            onChange={(e) => onNewAdminUsernameChange(e.target.value)}
            className="w-full border-b border-white/20 bg-transparent py-3 font-serif text-xl italic text-white outline-none transition-all duration-700 focus:border-accent"
          />
        </div>
        <div className="space-y-4">
          <label className="small-caps text-[9px] font-bold tracking-[0.2em] text-background/40">
            Credential: Cipher (Password)
          </label>
          <input
            type="password"
            value={newAdminPassword}
            onChange={(e) => onNewAdminPasswordChange(e.target.value)}
            className="w-full border-b border-white/20 bg-transparent py-3 text-white outline-none transition-all duration-700 focus:border-accent"
          />
        </div>
        <button
          onClick={onAddAdmin}
          className="flex items-center justify-center gap-3 rounded-sm bg-accent py-5 text-[11px] font-bold uppercase tracking-[0.3em] text-white shadow-lg transition-all duration-700 hover:bg-white hover:text-foreground"
        >
          <UserPlus className="h-4 w-4" />
          Empower Administrator
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="group flex flex-col items-center gap-6 border border-border bg-white p-8 transition-all duration-1000 hover:border-accent hover:shadow-editorial"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border transition-all duration-1000 group-hover:rotate-12 group-hover:bg-foreground group-hover:text-background">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="font-serif text-lg italic text-foreground transition-colors group-hover:text-accent">{admin.username}</p>
              <p className="small-caps mt-1 text-[8px] font-bold tracking-widest text-muted-foreground/40">Authorized Entity</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
