import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, fetchUserProfile } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(undefined); // undefined = still loading
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function handleAuthUpdate(e) {
      if (e.detail) {
        setProfile(e.detail);
      } else {
        setProfile(null);
      }
    }
    window.addEventListener('vidyaverse_auth_update', handleAuthUpdate);
    return () => window.removeEventListener('vidyaverse_auth_update', handleAuthUpdate);
  }, []);

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Try to get Firestore profile; fall back to localStorage
        try {
          const firestoreProfile = await fetchUserProfile(firebaseUser.uid);
          if (firestoreProfile) {
            setProfile(firestoreProfile);
          } else {
            // Pull from localStorage (offline / Firebase not configured)
            const cached = localStorage.getItem('vidyaverse_profile');
            setProfile(cached ? JSON.parse(cached) : null);
          }
        } catch {
          const cached = localStorage.getItem('vidyaverse_profile');
          setProfile(cached ? JSON.parse(cached) : null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  function refreshProfile() {
    if (!user) return;
    fetchUserProfile(user.uid)
      .then(p => { if (p) setProfile(p); })
      .catch(() => {});
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
