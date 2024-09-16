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
        courseID: number,
        industryID: number,
        teamID: number,
        firmID:number,
        teamName: string,
        activePeriod: number,
        industryName: string,
        courseCode: string,
        selectedPeriod: number,
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
        signIn: '/auth/login', // Custom login page route
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                teamID: { label: "teamID", type: "" },
                userID: { label: "userID", type: "" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {

                    const res = await axios.post(
                        `${API_URI}api/participant-auth-token/`,
                        {
                            team: credentials?.teamID,
                            user: credentials?.userID,
                            password: credentials?.password,
                        }
                    );

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
            console.log(trigger)

            if (trigger === 'update') {
                if (session?.teamID) {
                    token.teamID = session.teamID[0];
                }
                if (session?.activePeriod) {
                    token.activePeriod = session.activePeriod;
                }
                if (session?.industryID) {
                    token.industryID = session.industryID;
                }
                if (session?.courseID) {
                    token.courseID = session.courseID;
                }
                if (session?.teamName) {
                    token.teamName = session.teamName;
                }
                if (session?.industryName) {
                    token.industryName = session.industryName;
                }
                if (session?.courseCode) {
                    token.courseCode = session.courseCode;
                }
                if (session?.selectedPeriod) {
                    token.selectedPeriod = session.selectedPeriod;
                }
                if (session?.firmID) {
                    token.firmID = session.firmID;
                }
            }
            if (user?.token) {
                token.accessToken = user.token as string;
            }
            return token;
        },

        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.teamID = token.teamID as number;
            session.activePeriod = token.activePeriod as number;;
            session.industryID = token.industryID as number;
            session.teamName = token.teamName as string;
            session.courseID = token.courseID as number;
            session.industryName = token.industryName as string;
            session.courseCode = token.courseCode as string;
            session.selectedPeriod = token.selectedPeriod as number;
            session.firmID = token.firmID as number;


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

export { handler as GET, handler as POST }

export default handler