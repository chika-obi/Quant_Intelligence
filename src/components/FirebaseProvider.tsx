import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged, User, db, doc, onSnapshot, setDoc } from '../firebase';
import { UserConfig } from '../types';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  userConfig: UserConfig | null;
  error: string | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  userConfig: null,
  error: null,
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userConfig, setUserConfig] = useState<UserConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("FirebaseProvider mounted, starting auth listener...");
    let unsubscribeConfig: (() => void) | null = null;

    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("Firebase initialization is taking longer than expected...");
      }
    }, 10000);

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth state changed:", currentUser ? `User: ${currentUser.uid}` : "No user");
      clearTimeout(timeoutId);
      
      // Clean up previous config listener if it exists
      if (unsubscribeConfig) {
        unsubscribeConfig();
        unsubscribeConfig = null;
      }

      setUser(currentUser);
      
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        console.log("Subscribing to user config snapshot...");
        
        unsubscribeConfig = onSnapshot(userDocRef, (docSnap) => {
          console.log("Config snapshot received, exists:", docSnap.exists());
          if (docSnap.exists()) {
            const data = docSnap.data() as UserConfig;
            const isAdminEmail = currentUser.email === 'kpanukuchikaobi@gmail.com';
            
            if (isAdminEmail && data.role !== 'admin') {
              const updatedConfig = { ...data, role: 'admin' as const };
              setDoc(userDocRef, updatedConfig, { merge: true });
              setUserConfig(updatedConfig);
            } else {
              setUserConfig(data);
            }
            setError(null);
          } else {
            const isAdminEmail = currentUser.email === 'kpanukuchikaobi@gmail.com';
            const initialConfig: UserConfig = {
              userId: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Quant Researcher',
              confidenceThreshold: 0.85,
              learningRate: 0.001,
              notificationsEnabled: true,
              researchMode: false,
              updatedAt: new Date().toISOString(),
              role: isAdminEmail ? 'admin' : 'viewer'
            };
            setDoc(userDocRef, initialConfig)
              .catch(err => {
                console.error("Error initializing user config:", err);
                setError("Failed to initialize user settings.");
              });
            setUserConfig(initialConfig);
          }
          setLoading(false);
        }, (err) => {
          console.error("Firestore Error (Config):", err);
          setError("Unable to sync your settings. Please check your connection.");
          setLoading(false);
        });
      } else {
        setUserConfig(null);
        setLoading(false);
      }
    });

    return () => {
      console.log("FirebaseProvider unmounting, cleaning up...");
      clearTimeout(timeoutId);
      unsubscribeAuth();
      if (unsubscribeConfig) {
        unsubscribeConfig();
      }
    };
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, loading, userConfig, error }}>
      {children}
    </FirebaseContext.Provider>
  );
};
