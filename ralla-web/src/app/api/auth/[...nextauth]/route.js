import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // 1. Google Provider ගත්තා
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
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
    // 2. Google වලින් එන කෙනා Database එකේ නැත්නම් Save කරගන්න කෑල්ල
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const { name, email, image } = user;
          await connectToDatabase();

          // බලනවා මේ email එකෙන් කෙනෙක් ඉන්නවද කියලා
          const existingUser = await User.findOne({ email });

          if (!existingUser) {
            // නැත්නම් අලුත් User කෙනෙක් හදනවා
            await User.create({
              name,
              email,
              image,
              role: "user", // Google වලින් එන අයටත් මුලින් 'user' රෝල් එක දෙනවා
              password: "", // Google අයගේ password එකක් නෑ (හිස්ව තියනවා)
            });
          }
          return true; // Login වෙන්න දෙනවා
        } catch (error) {
          console.log("Error checking if user exists: ", error);
          return false;
        }
      }
      return true; // Credentials වලින් එන අයට නිකන්ම යන්න දෙනවා
    },

    async jwt({ token, user }) {
        if (user) {
            // Google වලින් ආවම user object එකේ role එක කෙලින්ම නැති වෙන්න පුළුවන්, 
            // ඒ නිසා අපි Database එකෙන් ආයේ check කරගන්නවා නම් වඩා හොඳයි.
            // නමුත් දැනට සරලව මෙහෙම තියමු. Login වුනාම ඊළඟ පාර මේක වැඩ කරනවා.
            
            // අපි පොඩි ආරක්ෂිත පියවරක් ගමු:
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
});

export { handler as GET, handler as POST };