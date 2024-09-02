// api/forums/details.ts

import authValues from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import client from '@/db';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authValues);
    if (!session?.user) {
        return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    try {
        const forums = await client.forums.findMany({
            where: {
                authorId: session.user.id,
            },
        });
        return NextResponse.json(forums);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ msg: "Error occurred while fetching forums" }, { status: 500 });
    }
}
