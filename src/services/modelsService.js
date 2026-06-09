import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore'
import { db, isConfigured } from './firebaseConfig'

const COLLECTION = 'models'

export async function fetchAllModels() {
  if (!isConfigured || !db) return null
  const snap = await getDocs(collection(db, COLLECTION))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function saveModel(model) {
  if (!isConfigured || !db) return
  await setDoc(
    doc(db, COLLECTION, model.id),
    {
      name: model.name,
      email: model.email,
      tagline: model.tagline || 'ელიტური მოდელი',
      avatar: model.avatar || null,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  )
}

export async function deleteModelFromFirestore(modelId) {
  if (!isConfigured || !db) return
  await deleteDoc(doc(db, COLLECTION, modelId))
}
