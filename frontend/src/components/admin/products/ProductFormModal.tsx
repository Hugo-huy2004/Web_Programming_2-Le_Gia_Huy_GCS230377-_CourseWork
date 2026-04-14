import { useDropzone } from "react-dropzone"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, Upload, X } from "lucide-react"
import type { MetalType } from "@/types/product"

export type ProductFormState = {
  name: string
  category: string
  metalType: MetalType
  weightChi: string
  makingFee: string
  discountPercent: string
  stock: string
  imageUrl: string
  description: string
  isNew: boolean
}

type ProductFormModalProps = {
  isOpen: boolean
  editingId: string | null
  form: ProductFormState
  setForm: React.Dispatch<React.SetStateAction<ProductFormState>>
  categories: string[]
  onUploadImage: (file: File) => Promise<string | null>
  onClose: () => void
  onSave: () => void
}

export function ProductFormModal({
  isOpen,
  editingId,
  form,
  setForm,
  categories,
  onUploadImage,
  onClose,
  onSave,
}: ProductFormModalProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: async (files: File[]) => {
      if (!files[0]) return
      const publicUrl = await onUploadImage(files[0])
      if (!publicUrl) return
      setForm((prev) => ({ ...prev, imageUrl: publicUrl }))
    },
  })

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="liquid-glass-strong relative max-h-[90vh] w-full max-w-4xl space-y-12 overflow-y-auto rounded-sm border border-border/40 p-10 shadow-2xl md:p-16"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="small-caps text-[10px] tracking-[0.2em] text-accent">Registry Entry / Vol. {new Date().getFullYear()}</p>
              <h3 className="font-serif text-4xl italic tracking-tight text-foreground">
                {editingId ? "Refine Asset Protocol" : "New Heritage Registry"}
              </h3>
            </div>
            <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-secondary">
              <X className="h-6 w-6 text-muted-foreground/40" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="small-caps text-[9px] tracking-[0.2em] text-muted-foreground">Asset Identity</label>
                <input
                  type="text"
                  placeholder="Title of Masterpiece"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-b border-border/60 bg-transparent py-2 font-serif text-xl italic text-foreground outline-none transition-all duration-700 focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="small-caps text-[9px] tracking-[0.2em] text-muted-foreground">Series / Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border-b border-border/60 bg-transparent py-2 font-serif text-lg italic text-foreground outline-none transition-all duration-700 focus:border-accent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="small-caps text-[9px] tracking-[0.2em] text-muted-foreground">Metal Grade</label>
                  <select
                    value={form.metalType}
                    onChange={(e) => setForm({ ...form, metalType: e.target.value as MetalType })}
                    className="w-full border-b border-border/60 bg-transparent py-2 font-serif text-lg italic text-foreground outline-none transition-all duration-700 focus:border-accent"
                  >
                    {["24K", "18K", "14K", "10K", "Silver9999"].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="small-caps text-[9px] tracking-[0.2em] text-muted-foreground">Weight (Mace)</label>
                  <input
                    type="number"
                    value={form.weightChi}
                    onChange={(e) => setForm({ ...form, weightChi: e.target.value })}
                    className="w-full border-b border-border/60 bg-transparent py-2 font-mono text-base outline-none transition-all duration-700 focus:border-accent"
                  />
                </div>
                <div className="space-y-4">
                  <label className="small-caps text-[9px] tracking-[0.2em] text-muted-foreground">Atelier Fee ($)</label>
                  <input
                    type="number"
                    value={form.makingFee}
                    onChange={(e) => setForm({ ...form, makingFee: e.target.value })}
                    className="w-full border-b border-border/60 bg-transparent py-2 font-mono text-base outline-none transition-all duration-700 focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="small-caps text-[9px] tracking-[0.2em] text-muted-foreground">Privilege Discount (%)</label>
                  <input
                    type="number"
                    value={form.discountPercent}
                    onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
                    className="w-full border-b border-border/60 bg-transparent py-2 font-mono text-base outline-none transition-all duration-700 focus:border-accent"
                  />
                </div>
                <div className="space-y-4">
                  <label className="small-caps text-[9px] tracking-[0.2em] text-muted-foreground">Vault Reserve</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full border-b border-border/60 bg-transparent py-2 font-mono text-base outline-none transition-all duration-700 focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="small-caps text-[9px] tracking-[0.2em] text-muted-foreground">Heritage Narrative</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full resize-none border border-border/40 p-4 font-serif text-base italic text-muted-foreground outline-none transition-all duration-700 focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-3">
                <div
                  onClick={() => setForm({ ...form, isNew: !form.isNew })}
                  className={`relative h-5 w-10 cursor-pointer rounded-full transition-colors duration-500 ${
                    form.isNew ? "bg-accent" : "bg-muted"
                  }`}
                >
                  <motion.div
                    animate={{ x: form.isNew ? 22 : 2 }}
                    className="absolute top-1 h-3 w-3 rounded-full bg-white shadow-sm"
                  />
                </div>
                <label className="small-caps cursor-pointer text-[9px] tracking-[0.2em] text-muted-foreground/60">
                  New Collection Arrival
                </label>
              </div>
            </div>

            <div className="space-y-8">
              <div
                {...getRootProps()}
                className={`relative flex aspect-[4/5] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-sm border-2 border-dashed p-8 transition-all duration-700 ${
                  isDragActive
                    ? "border-accent bg-accent/5"
                    : "border-border/40 hover:border-accent hover:bg-secondary/30"
                }`}
              >
                <input {...getInputProps()} />
                {form.imageUrl ? (
                  <div className="group absolute inset-0">
                    <img
                      src={form.imageUrl}
                      className="h-full w-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center opacity-30 transition-opacity group-hover:opacity-100">
                    <Upload className="mx-auto mb-4 h-12 w-12" />
                    <p className="font-serif text-lg italic">Dispatch Visual Asset</p>
                    <p className="small-caps text-[9px] tracking-[0.2em]">Drop Masterpiece Imagery Here</p>
                  </div>
                )}
              </div>
              <div className="liquid-glass rounded-sm border border-border/20 p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-accent opacity-60" />
                  <p className="font-serif text-[12px] italic leading-relaxed text-muted-foreground/80">
                    Imagery should reflect the House&apos;s editorial aesthetic. High-contrast, monochromatic-leaning visuals are preferred for legacy registry consistency.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-10 border-t border-border/40 pt-10">
            <button
              onClick={onClose}
              className="small-caps text-[11px] font-bold tracking-[0.2em] text-muted-foreground/40 transition-all duration-500 hover:text-foreground"
            >
              Discard Entry
            </button>
            <button
              onClick={onSave}
              className="rounded-sm bg-foreground px-14 py-5 text-[11px] font-bold uppercase tracking-[0.3em] text-background outline-none transition-all duration-700 hover:bg-accent hover:shadow-xl"
            >
              Commit to Archive
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
