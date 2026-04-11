import { uploadDriveImageRequest } from "../lib/api"

export const uploadApiService = {
  uploadProductImage: async (file: File): Promise<{ ok: boolean; publicUrl: string; message: string }> => {
    const result = await uploadDriveImageRequest(file)
    return {
      ok: result.ok,
      publicUrl: result.file.publicUrl,
      message: result.message,
    }
  },
}
