import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';
import { API_URI } from "myconstants";
import { getUser } from "@/lib/auth";
import { logout } from "features/data";


declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      token: string;
      username: string;
      email: string;
      firstname: string;
      lastname: string;
      usertype: number;
      country: number;
      school: number;
    } & DefaultSession["user"];
    accessToken: string;  // Add accessToken to the session
    courseId: number,
    industryId: number,
    teamId: number,
    teamName:string,
    activePeriod: number
  }

  interface User {
    token: string;
  }

  interface JWT {
    accessToken: string;  // Add accessToken to the JWT token
  }
}

const handler = NextAuth({
  session: {
    strategy: 'jwt'
  },
  pages: {
    signOut:`${process.env.NEXT_PUBLIC_BASE_URL}/`
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${API_URI}rest-auth/login/`, {
            email: credentials?.email,
            password: credentials?.password
          });

          const user = res.data;

          if (user && user.key) {

            return {
              ...user,
              token: user.key,
            };
          } else {
            console.log('Invalid credentials');
            return null;
          }
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {

    async jwt({ token, user, trigger, session }) {

      if (trigger === 'update') {
        if (session?.teamId) {
          token.teamId = session.teamId;
        }
        if (session?.activePeriod) {
          token.activePeriod = session.activePeriod;
        }
        if (session?.industryId) {
          token.industryId = session.industryId;
        }
        if (session?.courseId) {
          token.courseId = session.courseId;
        }
        if (session?.teamName) {
          token.teamName = session.teamName;
        }
      }
      if (user?.token) {
        token.accessToken = user.token as string;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string; 
      session.teamId = token.teamId as number;  
      session.activePeriod = token.activePeriod as number;  ;
      session.industryId = token.industryId as number;
      session.teamName = token.teamName as string;
      session.courseId = token.courseId as number;
      
      if (session.accessToken) {
        try {
          const user = await getUser(session.accessToken)
          session.user = {
            ...session.user,
            ...user,
          };
           // Check if the usertype is allowed (usertype === 1)
           if (session.user.usertype !== 1) {
            await logout(session.accessToken)
            console.log('Unauthorized: Usertype is not allowed.');
            throw new Error('Unauthorized');
        }

        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      return session;
    },

  },
  secret: process.env.NEXTAUTH_SECRET, // Use a strong secret key
});

export { handler as GET, handler as POST }