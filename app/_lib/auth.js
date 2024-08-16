import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(authConfig);
// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [Google],
// })
