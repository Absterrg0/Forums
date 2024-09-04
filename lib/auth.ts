import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import client from '@/db';
import bcrypt from 'bcrypt';
import GitHubProvider from "next-auth/providers/github";

export const authValues: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID! ,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'Enter Username' },
                password: { label: 'Password', type: 'password', placeholder: 'Enter Password' }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Missing Username or Password");
                }

                try {
                    const user = await client.user.findFirst({
                        where: { username: credentials.username }
                    });

                    if (!user) {
                        throw new Error("No user found with this username");
                    }

                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                    if (!isValidPassword) {
                        throw new Error("Incorrect Password");
                    }

                    // Return user object if authentication is successful
                    return {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        isAdmin: user.isAdmin // Include admin status
                    };
                } catch (e) {
                    console.error(e);
                    throw new Error("Username/Password is Incorrect");
                }
            }
        })
    ],
    pages: {
        signIn: '/signin'
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as number;
                token.name = user.name;
                token.username = user.username;
                token.email = user.email;
                token.isAdmin = user.isAdmin; // Include admin status in the token
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id,
                    username: token.username,
                    email: token.email,
                    name: token.name,
                    isAdmin: token.isAdmin // Include admin status in the session
                };
            }
            return session;
        }
    }
};

export default authValues;
