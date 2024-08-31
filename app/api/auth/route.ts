import { NextRequest, NextResponse } from "next/server";
import client from '@/db'
import bcrypt from 'bcrypt'


export async function POST(req:NextRequest,res:NextResponse){

    try{
        const body = await req.json();
        const hashedPassword = await bcrypt.hash(body.password,10)
        const res = await client?.user.create({
            data:{
                name:body.name,
                username:body.username,
                email:body.email,
                password:hashedPassword,
                image:body.image
            }
        })
        return NextResponse.json({
            res
        })
    }catch(e){
        console.error(e);
        return NextResponse.json({
            msg:"Error while creating the user"
        })
    }
}