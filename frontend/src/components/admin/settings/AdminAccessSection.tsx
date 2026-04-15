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
    <section className="space-y-5 md:space-y-12">
      <div className="border-b border-border/40 pb-3 md:pb-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-accent md:mb-3 md:small-caps md:font-medium md:tracking-[0.2em]">Personnel Registry</p>
        <h2 className="text-lg font-semibold tracking-tight text-foreground md:font-serif md:text-4xl md:italic">Administrative Access</h2>
      </div>

      <div className="liquid-glass-strong grid grid-cols-1 items-end gap-3 rounded-sm p-3 text-foreground shadow-editorial md:grid-cols-3 md:gap-12 md:p-12">
        <div className="space-y-1.5 md:space-y-4">
          <label className="text-[10px] font-medium text-foreground/60 md:small-caps md:text-[9px] md:font-bold md:tracking-[0.2em] md:text-foreground/50">
            Credential: Principal Username
          </label>
          <input
            type="text"
            value={newAdminUsername}
            onChange={(e) => onNewAdminUsernameChange(e.target.value)}
            className="h-10 w-full rounded-sm border border-border/50 bg-background px-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-accent md:h-auto md:border-0 md:border-b md:bg-transparent md:px-0 md:py-3 md:font-serif md:text-xl md:italic md:duration-700"
          />
        </div>
        <div className="space-y-1.5 md:space-y-4">
          <label className="text-[10px] font-medium text-foreground/60 md:small-caps md:text-[9px] md:font-bold md:tracking-[0.2em] md:text-foreground/50">
            Credential: Cipher (Password)
          </label>
          <input
            type="password"
            value={newAdminPassword}
            onChange={(e) => onNewAdminPasswordChange(e.target.value)}
            className="h-10 w-full rounded-sm border border-border/50 bg-background px-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-accent md:h-auto md:border-0 md:border-b md:bg-transparent md:px-0 md:py-3 md:text-base md:duration-700"
          />
        </div>
        <button
          onClick={onAddAdmin}
          className="flex h-10 items-center justify-center gap-1.5 rounded-sm bg-accent px-3 text-[9px] font-semibold uppercase tracking-[0.08em] text-white shadow-lg transition-all duration-300 hover:bg-white hover:text-foreground md:h-auto md:gap-3 md:px-0 md:py-5 md:text-[11px] md:font-bold md:tracking-[0.3em] md:duration-700"
        >
          <UserPlus className="h-3.5 w-3.5 md:h-4 md:w-4" />
          Empower Administrator
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 text-center sm:grid-cols-3 md:grid-cols-4 md:gap-8 lg:grid-cols-6">
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="group liquid-glass flex flex-col items-center gap-2.5 border border-border p-3 transition-all duration-300 hover:border-accent hover:shadow-editorial md:gap-6 md:p-8 md:duration-1000"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:rotate-12 group-hover:bg-foreground group-hover:text-background md:h-16 md:w-16 md:duration-1000">
              <Shield className="h-4 w-4 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground transition-colors group-hover:text-accent md:font-serif md:text-lg md:italic">{admin.username}</p>
              <p className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.08em] text-muted-foreground/55 md:small-caps md:mt-1 md:font-bold md:tracking-widest md:text-muted-foreground/40">Authorized Entity</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
