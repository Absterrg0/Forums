import authValues from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import client from '@/db';

// GET - Read Forum (Public Access)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const forumId = parseInt(params.id, 10);
    if (isNaN(forumId)) {
        return NextResponse.json({ msg: "Invalid Id" }, { status: 400 });
    }

    try {
        const response = await client.forums.findFirst({
            where: { id: forumId }
        });

        if (!response) {
            return NextResponse.json({ msg: "Forum not found" }, { status: 404 });
        }

        return NextResponse.json(response );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Error while fetching forum" }, { status: 500 });
    }
}

// PUT - Update Forum (Authenticated Access)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authValues);

    if (!session?.user) {
        return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const forumId = parseInt(params.id, 10);
    if (isNaN(forumId)) {
        return NextResponse.json({ msg: "Invalid Id" }, { status: 400 });
    }

    try {
        const body = await req.json();
        const { title, description, tag } = body;

        if (!title && !description && !tag) {
            return NextResponse.json({ msg: "No values provided for update" }, { status: 400 });
        }

        const updatedData: { title?: string; description?: string; tag?: string } = {};
        if (title) updatedData.title = title;
        if (description) updatedData.description = description;
        if (tag) updatedData.tag = tag;

        const updatedForum = await client.forums.update({
            where: { id: forumId, authorId: session.user.id },
            data: updatedData
        });

        return NextResponse.json({ updatedForum });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Error occurred while updating forum" }, { status: 500 });
    }
}

// DELETE - Delete Forum (Authenticated Access)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authValues);

    if (!session?.user) {
        return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const forumId = parseInt(params.id, 10);
    if (isNaN(forumId)) {
        return NextResponse.json({ msg: "Invalid Id" }, { status: 400 });
    }

    try {
        const deletedForum = await client.forums.delete({
            where: { id: forumId, authorId: session.user.id }
        });

        return NextResponse.json({ deletedForum });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Error while deleting the forum" }, { status: 500 });
    }
}
