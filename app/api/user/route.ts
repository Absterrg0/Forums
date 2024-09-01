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

        // Fetch user details from the database
        const user = await client.user.findUnique({
            where: {
                id: session.user.id,
            },
        });

        if (!user) {
            return NextResponse.json({ msg: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Error while fetching user details" }, { status: 500 });
    }
}
