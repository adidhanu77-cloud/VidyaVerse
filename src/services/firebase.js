/**
 * VidyaVerse - Firebase Authentication Service
 * Supports: Google OAuth, Phone OTP, Email/Password
 * Real-time user data synced to Firestore
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Firebase config from environment variables
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase is configured
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('profile');
  googleProvider.addScope('email');
}

export { auth, db, isFirebaseConfigured };

/* ════════════════════════════════════════════════════════
   USER PROFILE HELPERS — FIRESTORE REAL-TIME SYNC
════════════════════════════════════════════════════════ */

/**
 * Create or update user document in Firestore on first login
 */
export async function syncUserToFirestore(firebaseUser, extraData = {}) {
  if (!db || !firebaseUser) return null;

  const userRef = doc(db, 'vidyaverse_users', firebaseUser.uid);
  const snap = await getDoc(userRef);

  const baseProfile = {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || extraData.name || '',
    email: firebaseUser.email || '',
    phone: firebaseUser.phoneNumber || extraData.phone || '',
    avatar: firebaseUser.photoURL || null,
    provider: extraData.provider || 'email',
    grade: extraData.grade || '',
    school: extraData.school || '',
    language: 'en',
    lastLoginAt: serverTimestamp(),
  };

  if (!snap.exists()) {
    // New user — create document
    await setDoc(userRef, {
      ...baseProfile,
      createdAt: serverTimestamp(),
      isProfileComplete: !!(baseProfile.name && baseProfile.grade),
    });
  } else {
    // Existing user — update login time only
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
      avatar: baseProfile.avatar || snap.data().avatar,
      name: snap.data().name || baseProfile.name,
    });
  }

  const updated = (await getDoc(userRef)).data();

  // Also keep localStorage in sync for offline access
  localStorage.setItem('vidyaverse_userId', firebaseUser.uid);
  localStorage.setItem('vidyaverse_profile', JSON.stringify({
    userId:   firebaseUser.uid,
    name:     updated.name || baseProfile.name,
    username: updated.username || '',
    email:    updated.email,
    phone:    updated.phone,
    avatar:   updated.avatar,
    grade:    updated.grade || '',
    school:   updated.school || '',
    language: updated.language || 'en',
    provider: updated.provider || baseProfile.provider,
  }));

  return updated;
}

/**
 * Update user profile data in Firestore
 */
export async function updateUserProfile(uid, data) {
  if (!db || !uid) return;
  const userRef = doc(db, 'vidyaverse_users', uid);
  await updateDoc(userRef, { ...data, updatedAt: serverTimestamp() });
}

/**
 * Fetch user profile from Firestore
 */
export async function fetchUserProfile(uid) {
  if (!db || !uid) return null;
  const snap = await getDoc(doc(db, 'vidyaverse_users', uid));
  return snap.exists() ? snap.data() : null;
}

/* ════════════════════════════════════════════════════════
   AUTH METHODS
════════════════════════════════════════════════════════ */

/**
 * Google Sign-In (popup)
 */
export async function signInWithGoogle() {
  if (!auth || !googleProvider) throw new Error('Firebase not configured');
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const profile = await syncUserToFirestore(user, { provider: 'google' });
  return { user, profile };
}

/**
 * Email + Password Sign Up
 */
export async function signUpWithEmail(email, password, displayName, extraData = {}) {
  if (!auth) throw new Error('Firebase not configured');
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  const profile = await syncUserToFirestore(cred.user, {
    provider: 'email',
    name: displayName,
    grade: extraData.grade || '',
    school: extraData.school || '',
  });
  return { user: cred.user, profile };
}

/**
 * Email + Password Sign In
 */
export async function signInWithEmail(email, password) {
  if (!auth) throw new Error('Firebase not configured');
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const profile = await syncUserToFirestore(cred.user, { provider: 'email' });
  return { user: cred.user, profile };
}

/**
 * Send Phone OTP — requires recaptchaContainerId div in DOM
 */
export async function sendPhoneOtp(phoneNumber, recaptchaContainerId = 'recaptcha-container') {
  if (!auth) throw new Error('Firebase not configured');
  const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
    size: 'invisible',
    callback: () => {},
  });
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
  return confirmationResult;
}

/**
 * Verify Phone OTP
 */
export async function verifyPhoneOtp(confirmationResult, otp) {
  const result = await confirmationResult.confirm(otp);
  const profile = await syncUserToFirestore(result.user, { provider: 'phone' });
  return { user: result.user, profile };
}

/**
 * Password Reset
 */
export async function resetPassword(email) {
  if (!auth) throw new Error('Firebase not configured');
  await sendPasswordResetEmail(auth, email);
}

/**
 * Sign Out
 */
export async function logOut() {
  if (!auth) return;
  localStorage.removeItem('vidyaverse_userId');
  localStorage.removeItem('vidyaverse_profile');
  localStorage.removeItem('vidyaverse_progress');
  await signOut(auth);
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
