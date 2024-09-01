import { DefaultSession, DefaultUser } from "next-auth";
import {JWT as NextAuthJWT} from 'next-auth/jwt'
declare module 'next-auth'{
    interface User extends DefaultUser{
        id: number,
        name:string,
        email:string,
        username:string,
        isAdmin?:boolean,
    }
    interface Session{
        user:{
            id : number,
            name:string,
            email:string,
            username:string,
            isAdmin?:boolean,
        }& DefaultSession["user"]
    }
}


declare module 'next-auth/jwt'{
    interface JWT extends NextAuthJWT{
        id:number,
        name:string,
        email:string,
        username:string,
        isAdmin?:boolean,
    }
}