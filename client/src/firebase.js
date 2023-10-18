import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDGU-PzrKVcqji0y5SnztrfA9_sh8nivkk",
  authDomain: "valegram-storage.firebaseapp.com",
  projectId: "valegram-storage",
  storageBucket: "valegram-storage.appspot.com",
  messagingSenderId: "378178315698",
  appId: "1:378178315698:web:01c9436ec745d30e2b70ab",
  measurementId: "G-TCEQRD3JL8"
}

const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)