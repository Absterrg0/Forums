import authValues from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import client from '@/db'


export async function PUT(req:NextRequest,{params}:{params:{id:string}}){
    const session = await getServerSession(authValues);
    if(!session?.user){
        return NextResponse.json({
            msg:"Unauthorized"
        })
    }
    const userId = parseInt(params.id);
    if(isNaN(userId)){
        return NextResponse.json({
            msg:"Invalid Id"
        })
    }
    try{
        const admin = await client.user.update({
            where:{
                id:userId
            },
            data:{
                isAdmin:true
            }
        })
        return NextResponse.json({
            admin
        })
    }catch(e){
        console.error(e);
        return NextResponse.json({
            msg:"Error while updating admin"
        })
    }
}