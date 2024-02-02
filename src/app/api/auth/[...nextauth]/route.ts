import NextAuth, { Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../../../helpers/db/firebase/firebase";
import { User } from "models/users.models";
import { JWT } from "next-auth/jwt";


export const authOptions = {
  // Configure one or more authentication providers
  pages: {
    signIn: '/signin'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials): Promise<any> {
        try {
          const data = await signInWithEmailAndPassword(auth, (credentials as any).email || '', (credentials as any).password || '');
  
          if (data.user) {

            const { user } = data;

            return {
              uid: user.uid,
              email: user.email,
              idToken: await user.getIdToken(),
            }
            // return {
            //   uid: user.user.uid,
            //   email: user.user.email,
            //   role: 'admin',
            // }
  
          }
          return null;

        } catch (error) {
          console.log(error);
          return null;
        }

        // return user;
        // return await signInWithEmailAndPassword(auth, (credentials as any).email || '', (credentials as any).password || '')
        //   .then(userCredential => {
        //     if (userCredential.user) {
        //       return userCredential.user;
        //     }
        //     return null;
        //   })
        //   .catch(error => (console.log(error)))
        //   .catch((error) => {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     console.log(error);
        //   });
      },
    })
  ],
  callbacks: {

    async jwt({ token, user }: { token: JWT, user: User}): Promise<JWT> {
      if (user) {
        token.user = user;
      }

      return token;
    },

    async session({ session, user, token }: { session: Session, user: User, token: JWT }): Promise<Session> {
      session.user = token.user as User;
      return session;
    },
  },
}
// export default NextAuth(authOptions);

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };