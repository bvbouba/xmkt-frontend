import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';
import { API_URI } from "myconstants";
import { getUser } from "@/lib/auth";

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

  }

  interface User {
    token: string;  
  }

  interface JWT {
    accessToken: string;  // Add accessToken to the JWT token
  }
}

const handler = NextAuth({
    session:{
       strategy:'jwt'
    },
    pages: {
        signIn: '/[lng]/login', // Custom login page route
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
    async jwt({ token, user }) {
      if (user?.token) {
        token.accessToken = user.token as string;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;  // Assign accessToken to session

      if (session.accessToken) {
        
        try {
          const user = await getUser(session.accessToken)
          session.user = {
            ...session.user,
            ...user,
          };
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      return session;
    },

  },
  secret: process.env.NEXTAUTH_SECRET, // Use a strong secret key
});

export {handler as GET, handler as POST}