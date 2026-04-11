type AdminEmptyStateProps = {
  message: string
}

export function AdminEmptyState({ message }: AdminEmptyStateProps) {
  return (
    <div className="rounded-sm border-2 border-dashed border-border/40 py-24 text-center">
      <p className="font-serif text-xl italic text-muted-foreground opacity-40">{message}</p>
    </div>
  )
}
