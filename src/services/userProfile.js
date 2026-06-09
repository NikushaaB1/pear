import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, isConfigured } from './firebaseConfig'

const ADMIN_EMAIL = 'admin@pear.elite'

export async function getUserProfile(firebaseUser) {
  if (!firebaseUser) return null

  const email = firebaseUser.email?.toLowerCase() || ''
  const isAdminEmail = email === ADMIN_EMAIL

  if (!isConfigured || !db) {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: isAdminEmail ? 'ადმინისტრატორი' : firebaseUser.displayName || email.split('@')[0],
      role: isAdminEmail ? 'admin' : 'model',
      modelId: isAdminEmail ? null : email.split('@')[0],
    }
  }

  const ref = doc(db, 'users', firebaseUser.uid)
  const snap = await getDoc(ref)

  if (snap.exists()) {
    const data = snap.data()
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: data.displayName || firebaseUser.displayName,
      role: data.role || 'model',
      modelId: data.modelId || null,
    }
  }

  const profile = {
    email,
    displayName: isAdminEmail ? 'ადმინისტრატორი' : firebaseUser.displayName || email.split('@')[0],
    role: isAdminEmail ? 'admin' : 'model',
    modelId: isAdminEmail ? null : email.split('@')[0],
    createdAt: new Date().toISOString(),
  }

  await setDoc(ref, profile)
  return { uid: firebaseUser.uid, ...profile }
}

export async function createUserProfile(uid, { email, displayName, role = 'model', modelId }) {
  if (!isConfigured || !db) return

  await setDoc(doc(db, 'users', uid), {
    email: email.toLowerCase(),
    displayName,
    role,
    modelId: role === 'admin' ? null : modelId || email.split('@')[0],
    createdAt: new Date().toISOString(),
  })
}
