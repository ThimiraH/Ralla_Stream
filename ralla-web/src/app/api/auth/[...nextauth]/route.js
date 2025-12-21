import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// 1. මෙන්න මේ විදිහට 'authOptions' කියලා වෙනම හදලා export කරන්න ඕන
export const authOptions = {
  providers: [
    // --- Google Login ---
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    
    // --- Email/Password Login ---
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error("No user found with this email");

        const checkPassword = await bcrypt.compare(credentials.password, user.password);
        if (!checkPassword) throw new Error("Password does not match");

        return { id: user._id, name: user.name, email: user.email, role: user.role, image: user.image };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const { name, email, image } = user;
          await connectToDatabase();
          const existingUser = await User.findOne({ email });

          if (!existingUser) {
            await User.create({
              name,
              email,
              image,
              role: "user",
              password: "",
            });
          }
          return true;
        } catch (error) {
          console.log("Error checking if user exists: ", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
        if (user) {
            if(!token.role && user.email) {
                 await connectToDatabase();
                 const dbUser = await User.findOne({ email: user.email });
                 if(dbUser) token.role = dbUser.role;
                 if(dbUser) token.id = dbUser._id;
            } else {
                token.role = user.role;
                token.id = user.id;
            }
        }
        return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

// 2. අන්තිමට මේ විදිහට Handler එක හදන්න
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };