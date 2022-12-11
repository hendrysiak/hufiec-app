import { ActionCodeSettings, Auth, User, UserCredential } from 'firebase/auth';

import React, { createContext, useContext } from 'react';

import useFirebaseAuth from 'helpers/db/firebase/useFirebaseAuth';

interface AuthUserContextValues {
  authUser: { uid: string, email: string | null } | null;
  loading: boolean;
  signInToApp: (email: string, password: string) => Promise<UserCredential> | Promise<null>;
  signOutFromApp: () => Promise<void> | null;
  resetPassword: (email: string) => Promise<void>;
}

const authUserContext = createContext<AuthUserContextValues>({
  authUser: null,
  loading: true,
  signInToApp: async () => null,
  signOutFromApp: async () => {},
  resetPassword: async () => {}
});

export function AuthUserProvider({ children }: { children: React.ReactElement}) {
  const auth = useFirebaseAuth();
  return <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>;
}

export const useAuth = () => useContext(authUserContext);