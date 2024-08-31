import { NextRequest, NextResponse } from "next/server";
import client from '@/db'
import { getServerSession } from "next-auth";
import authValues from "@/lib/auth";

export async function POST(req:NextRequest,res:NextResponse){
    const session = await getServerSession(authValues);
    if(!session?.user){
        return NextResponse.json({
            msg:"Unauthorized"
        })
    }

    const body = await req.json();
    try{
        const res = await client.forums.create({
            data:{
                title:body.title,
                description:body.description,
                tag:body.tag,
                authorId:session.user.id


            }
        })
        return NextResponse.json({
            res
        })
    }catch(e){
        console.error(e);
        return NextResponse.json({
            msg:"Error while creating forums"
        })
    }
}

export async function GET(){
    const session = await getServerSession(authValues);
    if(!session?.user){
        return NextResponse.json({
            msg:"Unauthorized"
        })
    }
    try{
        const forum = await client.user.findMany({})
        return NextResponse.json(
            forum
        )
    }catch(e){
        console.error(e);
        return NextResponse.json({
            msg:"Error occured while fetching forums"
        })
    }
}