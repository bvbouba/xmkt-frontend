import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';
import { API_URI } from "myconstants";
import { getUser } from "@/lib/auth";
import { CourseProps } from "types";
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
        accessToken: string;
        course:CourseProps;
    }

    interface User {
        token: string;
        pak: string; 
    }

    interface JWT {
        accessToken: string;
        pak: string; 
    }
}


const handler = NextAuth({
    session: {
        strategy: 'jwt'
    },
    pages: {
        signOut:`${process.env.NEXT_PUBLIC_BASE_URL}`
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "email" },
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
                if (session?.course) {
                    token.course = session.course;
                }
            }
            if (user?.token) {
                token.accessToken = user.token as string;
            }
            return token;
        },

        async session({ session, token }) {
            session.accessToken = token.accessToken as string;    
            session.course = token.course as CourseProps;            
            if (session.accessToken) {
                try {
                    const user = await getUser(session.accessToken);
                    session.user = {
                        ...session.user,
                        ...user,
                    };

                    // Check if the usertype is allowed (usertype === 2)
                    if (session.user.usertype !== 2) {
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

export { handler as GET, handler as POST };

export default handler;
