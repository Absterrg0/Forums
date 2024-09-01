import { NextRequest, NextResponse } from "next/server";
import client from '@/db'; // Adjust the import path to match your project structure
import { getServerSession } from 'next-auth';
import authValues from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        // Get the session to retrieve user ID
        const session = await getServerSession(authValues);

        if (!session?.user?.id) {
            return NextResponse.json({ msg: "User not authenticated" }, { status: 401 });
        }

        // Fetch all forums created by the user
        const forums = await client.forums.findMany({
            where: {
                authorId: session.user.id,
            },
        });


        return NextResponse.json(forums);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Error while fetching forums" }, { status: 500 });
    }
}
