import { NextRequest, NextResponse } from "next/server";
import client from '@/db';
import { getServerSession } from "next-auth";
import authValues from "@/lib/auth";
import sanitizeHtml from "sanitize-html";

// POST request handler for creating a new forum
export async function POST(req: NextRequest) {
    const session = await getServerSession(authValues);
    if (!session?.user) {
        return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    try {
        const sanitizedDescription = sanitizeHtml(body.description);
        const res = await client.forums.create({
            data: {
                title: body.title,
                description: sanitizedDescription,
                tag: body.tag,
                authorId: body.authorId
            },
        });
        return NextResponse.json({ res });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ msg: "Error while creating forum" }, { status: 500 });
    }
}

// GET request handler for fetching forums
export async function GET(req: NextRequest) {
    const session = await getServerSession(authValues);
    if (!session?.user) {
        return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    try {
        const forums = await client.forums.findMany({
            include: {
                author: true, // Include the author information
            },
        });

        if (forums.length === 0) {
            return NextResponse.json({ msg: "No forums found" }, { status: 404 });
        }

        return NextResponse.json(forums);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ msg: "Error occurred while fetching forums" }, { status: 500 });
    }
}
