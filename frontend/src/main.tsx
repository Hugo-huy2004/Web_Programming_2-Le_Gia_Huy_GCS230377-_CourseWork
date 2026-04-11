import { createRoot } from "react-dom/client"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { ThemeProvider } from "@/components/ThemeProvider"
import App from "./App.tsx"
import "./index.css"
 
// VITE_GOOGLE_CLIENT_ID is set in .env file
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string
 
createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <ThemeProvider defaultTheme="light" storageKey="hwj-theme">
      <App />
    </ThemeProvider>
  </GoogleOAuthProvider>
)
