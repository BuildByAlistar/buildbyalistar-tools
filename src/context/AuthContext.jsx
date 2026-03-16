import React, { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";
import { AuthContext } from "./authContext";

const FREE_PLAN_DAILY_LIMIT = 3;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const fetchUserProfile = useCallback(async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      setUserProfile(userDoc.data());
    } else {
      // Create a new profile for a new user
      const newUserProfile = {
        plan: "free",
        dailyUsageCount: 0,
        dailyUsageDate: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
      };
      await setDoc(userDocRef, newUserProfile);
      setUserProfile(newUserProfile);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      if (u) {
        await fetchUserProfile(u.uid);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [fetchUserProfile]);

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const u = result.user;
    if (u) {
      const userDocRef = doc(db, "users", u.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        const newUserProfile = {
          plan: "free",
          dailyUsageCount: 0,
          dailyUsageDate: new Date().toISOString().split('T')[0],
          createdAt: serverTimestamp(),
        };
        await setDoc(userDocRef, newUserProfile);
        setUserProfile(newUserProfile);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const canUseTool = () => {
    if (!userProfile) return false;
    if (userProfile.plan === "pro") return true;

    const today = new Date().toISOString().split('T')[0];
    if (userProfile.dailyUsageDate !== today) {
      // Reset daily usage for a new day
      const userDocRef = doc(db, "users", user.uid);
      setDoc(userDocRef, { dailyUsageDate: today, dailyUsageCount: 0 }, { merge: true });
      return true;
    }

    return userProfile.dailyUsageCount < FREE_PLAN_DAILY_LIMIT;
  };

  const incrementUsage = async () => {
    if (!user || !userProfile) return;
    if (userProfile.plan === "pro") return;

    const userDocRef = doc(db, "users", user.uid);
    const newUsageCount = (userProfile.dailyUsageCount || 0) + 1;
    await setDoc(userDocRef, { dailyUsageCount: newUsageCount }, { merge: true });
    setUserProfile({ ...userProfile, dailyUsageCount: newUsageCount });
  };

  const value = {
    user,
    loading,
    userProfile,
    loginWithGoogle,
    logout,
    canUseTool,
    incrementUsage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
