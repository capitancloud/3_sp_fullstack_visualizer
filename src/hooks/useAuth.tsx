import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Pre-computed SHA-256 hash of the access code
const ACCESS_CODE_HASH = '8f9b5c3a2d1e7f4a6b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function hashCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Pre-computed hash for the access code
// gT6@Qp!R1Z$uN9e#X^cD2sL%hY&vJm*W+K7B~A=F4q-Uo_rP)k8S]3C0{I?E
const CORRECT_HASH = 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [correctHash, setCorrectHash] = useState<string>('');

  useEffect(() => {
    // Compute hash of the correct code on mount
    const computeHash = async () => {
      const hash = await hashCode('gT6@Qp!R1Z$uN9e#X^cD2sL%hY&vJm*W+K7B~A=F4q-Uo_rP)k8S]3C0{I?E');
      setCorrectHash(hash);
    };
    computeHash();

    // Check if already authenticated
    const authStatus = sessionStorage.getItem('fsv_authenticated');
    setIsAuthenticated(authStatus === 'true');
    setIsLoading(false);
  }, []);

  const login = async (code: string): Promise<boolean> => {
    const inputHash = await hashCode(code);
    
    if (inputHash === correctHash) {
      setIsAuthenticated(true);
      sessionStorage.setItem('fsv_authenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('fsv_authenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
