import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import client from '@/db'
import bcrypt from 'bcrypt'
export const authValues: AuthOptions = {
    providers:[
        CredentialsProvider({
            name:'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'Enter Username' },
                password: { label: 'Password', type: 'password', placeholder: 'Enter Password' }
            },
            async authorize(credentials){
                if(!credentials|| !credentials.username || !credentials.password){
                    throw new Error("Missing Username or Password")
                }
                try{
                    const user = await client.user.findFirst({
                        where:{
                            username:credentials.username
                        }
                    })
                    console.log("User Found")
                    if(!user){
                        throw new Error("No user found with this username")
                    }
                    const isValidPassword = await bcrypt.compare(credentials.password,user.password)
                    if(!isValidPassword){
                        throw new Error("Incorrect Password")
                    }
                    return {
                        id:user.id,
                        name:user.name,
                        username:user.username,
                        email:user.email,
                        image:user.image
                    };
                }catch(e){
                    console.error(e);
                    throw new Error("Username/Password is Incorrect")
                }
            }

        })
    ],
    pages:{
        signIn : '/signin'
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks:{
        async jwt({ token, user }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (user) {
              token.id = user.id as number
              token.name = user.name,
              token.username = user.username,
              token.email = user.email,
              token.image = user.image
              
            }
            return token
          },
        async session({session,token}){
            if(token){
                session.user = {
                    id : token.id,
                    username : token.username,
                    email : token.email,
                    name : token.name,
                    image:token.image
                }
            }
            return session;
        }
    }
}


export default authValues