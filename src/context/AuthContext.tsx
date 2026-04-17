import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserProfile {
  id: string;
  name: string;
  role: 'Admin' | 'BranchManager' | 'Secretary' | 'Employee';
  academicId: string;
}

interface AuthContextType {
  userProfile: UserProfile | null;
  login: (id: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MASTER_KEYS: Record<string, { role: 'Admin' | 'BranchManager' | 'Secretary' | 'Employee', name: string, pass: string }> = {
  'admin_aastmt': { role: 'Admin', name: 'System Admin', pass: 'Admin@2026' },
  'manager_branch': { role: 'BranchManager', name: 'Branch Manager', pass: 'Manager@2026' },
  'sec_office': { role: 'Secretary', name: 'Office Secretary', pass: 'Sec@2026' },
  'staff_member': { role: 'Employee', name: 'Staff Member', pass: 'Staff@2026' },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    // INITIALIZATION: Check for saved session in memory
    const saved = localStorage.getItem('aastmt_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Auto-persist whenever the profile changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('aastmt_session', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('aastmt_session');
    }
  }, [userProfile]);

  const login = async (id: string, pass: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const masterUser = MASTER_KEYS[id.toLowerCase().trim()];
      
      if (masterUser && masterUser.pass === pass) {
        setUserProfile({
          id: id,
          name: masterUser.name,
          role: masterUser.role,
          academicId: 'USR-' + Math.floor(Math.random() * 900 + 100)
        });
        return;
      }

      throw new Error("Invalid Credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ userProfile, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
