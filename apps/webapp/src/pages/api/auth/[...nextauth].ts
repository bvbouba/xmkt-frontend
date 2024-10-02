import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';
import { API_URI } from "myconstants";
import { getUser } from "@/lib/auth";
import { loadInfo } from "features/data";

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
        pak: string; // Add pak here
        courseID: number;
        industryID: number;
        teamID: number;
        firmID: number;
        teamName: string;
        activePeriod: number;
        industryName: string;
        courseCode: string;
        selectedPeriod: number;
        refresh:number;
        selectedMarketID?:number;
        selectedBrandID?:number;
        selectedProjectID?:number;
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

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/marketing'

const handler = NextAuth({
    session: {
        strategy: 'jwt'
    },
    pages: {
         signOut:`${process.env.NEXT_PUBLIC_BASE_URL}${basePath}`
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                pak: { label: "pak", type: "" },
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
                            pak:credentials?.pak
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
                if (session?.selectedPeriod !== undefined) {
                    token.selectedPeriod = session.selectedPeriod;
                }
                if (session?.firmID) {
                    token.firmID = session.firmID;
                }
                if (session?.refresh) {
                    token.refresh = session.refresh;
                }
                if (session?.selectedBrandID) {
                    token.selectedBrandID = session.selectedBrandID;
                }
                if (session?.selectedMarketID) {
                    token.selectedMarketID = session.selectedMarketID;
                }
                if (session?.selectedProjectID) {
                    token.selectedProjectID = session.selectedProjectID;
                }
            }
            if (user?.token) {
                token.accessToken = user.token as string;
            }
            if (user?.pak) {
                token.pak = user.pak as string;
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
            session.pak = token.pak as string;
            session.refresh = token.refresh as number;
            session.selectedBrandID = token.selectedBrandID as number;
            session.selectedMarketID = token.selectedMarketID as number;
            session.selectedProjectID = token.selectedProjectID as number;
            
            if (session.accessToken) {
                try {
                    const user = await getUser(session.accessToken)
                    session.user = {
                        ...session.user,
                        ...user,
                    };
                    const participant = await loadInfo({pak:session.pak})
                    session = {
                        ...session,
                        industryName:participant?.industry_name,
                        courseCode:participant?.courseid,
                        courseID:participant.course,
                        teamName:participant?.team_name,
                        activePeriod:participant?.active_period,
                        teamID:participant?.team[0],
                        firmID:participant?.firm_id,
                        industryID:participant?.industry_id
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

export default handler