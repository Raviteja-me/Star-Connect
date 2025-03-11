import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, username: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultContext: AuthContextType = {
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {}
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

    const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error; // Re-throw the error for handling in the component
    }
  };

  const signUp = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Add user to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        username: username,
        email: email,
      });

      // Update the user's profile with the username
      await updateProfile(userCredential.user, { displayName: username });

      console.log("User created:", userCredential.user, "with username:", username);
    } catch (error) {
      console.error("Error signing up:", error);
      throw error; // Re-throw the error for handling in the component
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Check if this is a new user
      const userRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // Add new user to Firestore
        await setDoc(userRef, {
          uid: result.user.uid,
          username: result.user.displayName,
          email: result.user.email,
        });
      }

    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

    const signOut = async () => {
    try {
      await auth.signOut();
      navigate("/"); // Immediate redirect to home
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
