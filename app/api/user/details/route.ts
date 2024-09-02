import authValues from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import client from '@/db'
// GET request handler for fetching forums
export async function GET(req: NextRequest) {
    const session = await getServerSession(authValues);
    if (!session?.user) {
        return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await client.user.findUnique({
            where:{
                id:session.user.id
            }

        });
        return NextResponse.json(user);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ msg: "Error occurred while fetching forums" }, { status: 500 });
    }
}
