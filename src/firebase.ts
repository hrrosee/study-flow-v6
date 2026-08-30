import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut, 
  sendPasswordResetEmail,
  updatePassword,
  confirmPasswordReset,
  verifyPasswordResetCode,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  getFirestore
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDt5XgqlkGSukXpSwOfgMLQDaWwqHliswA",
  authDomain: "study-flow-v4.firebaseapp.com",
  projectId: "study-flow-v4",
  storageBucket: "study-flow-v4.firebasestorage.app",
  messagingSenderId: "777583832618",
  appId: "1:777583832618:web:86bed2cf2f60d448441d53",
  measurementId: "G-NKLN7E8R6Z"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ 
  prompt: 'select_account' 
});

// Initialize Firestore with Multi-Tab Persistent Offline Cache
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch (e) {
  firestoreDb = getFirestore(app);
}

export const db = firestoreDb;

// Auth Helper Functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Firebase signInWithPopup error:', error);
    return { user: null, error: error.message || 'Google sign-in failed' };
  }
};

export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message || 'Login failed' };
  }
};

export const registerWithEmail = async (name: string, email: string, pass: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (result.user && name.trim()) {
      await updateProfile(result.user, { displayName: name.trim() });
    }
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message || 'Registration failed' };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message || 'Logout failed' };
  }
};

export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || 'Password reset failed' };
  }
};

export const updateUserProfile = async (displayName: string, photoURL?: string) => {
  if (!auth.currentUser) return { error: 'No user signed in' };
  try {
    await updateProfile(auth.currentUser, {
      displayName: displayName.trim(),
      ...(photoURL !== undefined ? { photoURL } : {})
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message || 'Failed to update profile' };
  }
};

export const updateUserPassword = async (newPassword: string) => {
  if (!auth.currentUser) return { success: false, error: 'No user signed in' };
  try {
    await updatePassword(auth.currentUser, newPassword);
    return { success: true, error: null };
  } catch (error: any) {
    if (error.code === 'auth/requires-recent-login') {
      return { 
        success: false, 
        error: 'For security reasons, please log out and log back in before updating your password.', 
        code: 'requires-recent-login' 
      };
    }
    return { success: false, error: error.message || 'Failed to update password' };
  }
};

export const resetPasswordWithCode = async (oobCode: string, newPassword: string) => {
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || 'Invalid or expired password reset link.' };
  }
};

export { onAuthStateChanged, getRedirectResult };
export type { User };
export default app;
