import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA-631JxDZ0AlrWttiS3ndqGAQoMUrl1RM",
  authDomain: "obitra-608e3.firebaseapp.com",
  databaseURL: "https://obitra-608e3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "obitra-608e3",
  storageBucket: "obitra-608e3.firebasestorage.app",
  messagingSenderId: "35826304989",
  appId: "1:35826304989:web:18baa2f19a30df465f5834"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function fbGet(key) {
  try {
    const snap = await get(ref(db, `shared/${key}`));
    return snap.exists() ? snap.val() : null;
  } catch (e) {
    console.error("Firebase get error:", e);
    return null;
  }
}

export async function fbSet(key, value) {
  try {
    await set(ref(db, `shared/${key}`), value);
  } catch (e) {
    console.error("Firebase set error:", e);
  }
}

export function fbListen(key, callback) {
  return onValue(ref(db, `shared/${key}`), (snap) => {
    if (snap.exists()) callback(snap.val());
  });
}

export { db };
