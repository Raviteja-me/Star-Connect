import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
  import { auth, db } from '../config/firebase';
  import {
    onAuthStateChanged,
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    linkWithCredential,
    fetchSignInMethodsForEmail,
    signOut
  } from 'firebase/auth';
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
        if (!user) {
          navigate('/');
        }
      });

      return unsubscribe;
    }, [navigate]);

    const signIn = async (email, password) => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error("Error signing in:", error);
        throw error;
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
        throw error;
      }
    };

    const signInWithGoogle = async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if the user already exists
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          // If the user doesn't exist, create a new user document
          await setDoc(userDocRef, {
            uid: user.uid,
            username: user.displayName,
            email: user.email,
            // Add any other relevant user data
          });
          console.log('New user created with Google Sign-In');
        } else {
          console.log('User already exists');
        }


      } catch (error) {
        console.error("Error during Google Sign-In:", error);

        // Check if the error is due to account already existing with different credentials
        if (error.code === 'auth/account-exists-with-different-credential') {
          const email = error.customData.email;
          const credential = GoogleAuthProvider.credentialFromError(error);

          // Fetch sign-in methods for the email
          fetchSignInMethodsForEmail(auth, email)
            .then((methods) => {
              // If the user signed up with email/password, methods should contain 'password'
              if (methods.includes('password')) {
                // In a real application, you would prompt the user to sign in with their password
                // and then link the Google credential to their account.
                // For simplicity, we'll just log a message here.
                console.warn(`User with email ${email} already exists. Please sign in with your password and link your Google account.`);
                // You could throw a custom error here to be handled in the UI.
                throw new Error("Account already exists. Please sign in with your password and link your Google account.");
              } else {
                // Handle other cases or re-throw the error if unhandled.
                throw error;
              }
            })
            .catch((fetchError) => {
              console.error("Error fetching sign-in methods:", fetchError);
              throw fetchError; // Re-throw for handling in the component
            });
        } else {
          throw error; // Re-throw other errors for handling in the component
        }
      }
    };

    const signOutUser = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Error signing out:", error);
        throw error;
      }
    }

    return (
      <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut: signOutUser }}>
        {!loading && children}
      </AuthContext.Provider>
    );
  };

  export const useAuth = () => useContext(AuthContext);
