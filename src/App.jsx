import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import ToastProvider from './components/ui/ToastProvider'
import SplashScreen from './components/ui/SplashScreen'
import ErrorBoundary from './components/ErrorBoundary'
import Loader from './components/ui/Loader'
import { subscribeToAuth } from './services/firebaseAuth'
import { fetchAllModels, saveModel } from './services/modelsService'
import { useUserStore } from './store/useUserStore'
import { useThemeStore, applyTheme } from './store/useThemeStore'

export default function App() {
  const [authLoading, setAuthLoading] = useState(true)
  const { setUser, clearUser, showSplash, dismissSplash, ensureModelFromProfile, syncModels } =
    useUserStore()
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (profile) => {
      if (profile) {
        setUser(profile, profile.role, profile.modelId)
        if (profile.role === 'model') {
          ensureModelFromProfile(profile)
        }
        try {
          const remoteModels = await fetchAllModels()
          if (remoteModels) {
            syncModels(remoteModels)
            if (profile.role === 'admin') {
              const localModels = useUserStore.getState().models
              const remoteIds = new Set(remoteModels.map((m) => m.id))
              await Promise.all(
                localModels
                  .filter((m) => !remoteIds.has(m.id))
                  .map((m) => saveModel(m))
              )
            }
          }
          if (profile.role === 'model') {
            ensureModelFromProfile(profile)
          }
        } catch {
          /* local / offline mode */
        }
      } else {
        clearUser()
      }
      setAuthLoading(false)
    })
    return unsubscribe
  }, [setUser, clearUser, ensureModelFromProfile, syncModels])

  if (authLoading) {
    return <Loader fullScreen text="იტვირთება..." />
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider />
        {showSplash && <SplashScreen onComplete={dismissSplash} />}
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
