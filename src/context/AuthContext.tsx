import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User, signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, userProfile: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for Mock Bypass (1234/1234)
    const mockUser = sessionStorage.getItem('mock_user');
    if (mockUser) {
      setUser({ uid: 'mock-admin', email: 'admin@aastmt.edu' } as any);
      setUserProfile({ name: 'Fixed Admin', role: 'BranchManager', status: 'Approved' });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const docRef = doc(db, 'users', authUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const profile = docSnap.data();
          if (profile.status === 'Pending') {
            // User is authenticated but account is not approved
            setUser(null);
            setUserProfile(null);
            await signOut(auth); // Sign out if pending
          } else {
            setUser(authUser);
            setUserProfile(profile);
          }
        } else {
          // No profile found, probably just signed up and pending creation
          setUser(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
