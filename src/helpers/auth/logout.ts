import { signOut } from "next-auth/react";
import store from "store/store";
import { reduxIsAuthentication, reduxSetRoles } from "store/actions";

export const handleLogout = async () => {
  try {
    // Clear Redux state
    store.dispatch(reduxIsAuthentication(false));
    store.dispatch(reduxSetRoles([]));

    // Sign out from NextAuth
    await signOut({
      redirect: true,
      callbackUrl: "/signin",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    // Fallback redirect
    window.location.href = "/signin";
  }
};
