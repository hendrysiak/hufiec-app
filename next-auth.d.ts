import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            uid: string;
            idToken: string;
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        uid: string;
        email: string;
        role: string;
        idToken: string;
    }
}

declare module "next/auth/jwt" {
    interface JWT extends DefaultJWT {
        user: User
    }
}