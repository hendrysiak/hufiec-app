import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      uid: string;
      role: string;
      teams: string[];
      idToken: string;
      // ... other user properties
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    teams: string[];
    idToken: string;
    // ... other token properties
  }
}
