// /app/api/comments/route.ts
import { NextResponse } from "next/server";
import client from '@/db';

// POST - Create Comment
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { content, authorId, forumId, parentId } = body;

        if (!content || !authorId || !forumId) {
            return NextResponse.json({ msg: "Missing fields" }, { status: 400 });
        }

        const newComment = await client.comment.create({
            data: {
                content,
                authorId,
                forumId,
                parentId,
            },
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Error creating comment" }, { status: 500 });
    }
}

// GET - List Comments
export async function GET() {
    try {
        const comments = await client.comment.findMany({
            include: {
                replies: true, // Include replies for nested comments
                author: true, // Include author details
            },
        });
        return NextResponse.json(comments);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Error fetching comments" }, { status: 500 });
    }
}
