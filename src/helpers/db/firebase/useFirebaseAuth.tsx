import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User, sendPasswordResetEmail } from 'firebase/auth';
import { useState, useEffect } from 'react';

import { auth, app } from './firebase';

const formatAuthUser = (user: User) => ({
  uid: user.uid,
  email: user.email
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<{ uid: string, email: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState: User | null) => {
    if (!authState) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const formattedUser = formatAuthUser(authState);

    setAuthUser(formattedUser);

    setLoading(false);

  };

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signInToApp = (email: string, password: string) => 
    signInWithEmailAndPassword(auth, email, password);

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

  //   const createUserWithEmailAndPassword = (email: string, password: string) =>
  //     firebase.auth().createUserWithEmailAndPassword(email, password);

  const signOutFromApp = () =>
    signOut(auth).then(clear);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signInToApp,
    // createUserWithEmailAndPassword,
    signOutFromApp,
    resetPassword
  };
}