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

        // Google වලින් හදපු අයට password නැති නිසා check එකක් දාමු
        if (!user.password) throw new Error("Please login with Google");

        const checkPassword = await bcrypt.compare(credentials.password, user.password);
        if (!checkPassword) throw new Error("Password does not match");

        return { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, image: user.image };
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
      // User කෙනෙක් Log වෙන වෙලාවට (First Login)
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token._id = user._id || user.id;
      }

      // හැම Request එකකදීම Database එකෙන් අලුත්ම Status එක ගන්නවා
      // (නැත්නම් Admin දුන්න ගමන් Refresh වෙන්නේ නෑ)
      if (token.email) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token._id = dbUser._id;
          token.isAdmin = dbUser.isAdmin; // DB එකෙන් අලුත්ම අගය ගන්නවා
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {

        // Token එකේ තියෙන ID එක Session එකට දානවා
        session.user.id = token.id || token._id; 
        session.user._id = token.id || token._id; // MongoDB ID එකත්

        session.user.role = token.role;
        session.user.isAdmin = token.isAdmin; // 👇 Token එකෙන් Session එකට දානවා
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