import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';
import { API_URI } from "myconstants";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      token: string;
    } & DefaultSession["user"];
    accessToken: string;  // Add accessToken to the session
  }

  interface User {
    token: string;
    id: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    usertype: number;
    country: number;
    school: number;
  }

  interface JWT {
    accessToken: string;  // Add accessToken to the JWT token
  }
}

const handler = NextAuth({
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
  pages: {
    signIn: '/[lng]/login', // Custom login page route
  },
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
          const response = await axios.get(`${API_URI}rest-auth/user/`, {
            headers: {
              Authorization: `token ${session.accessToken}`,
            },
          });
          session.user = {
            ...session.user,
            ...response.data,
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