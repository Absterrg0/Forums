import authValues from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import client from '@/db';
import bcrypt from 'bcrypt';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authValues);
    if (!session?.user) {
        return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
        return NextResponse.json({ msg: "Invalid Id" }, { status: 400 });
    }

    try {
        const body = await req.json();
        const { name, username, email, password } = body;

        // Prepare update data
        const updateData: { name?: string, username?: string, email?: string, password?: string } = {};
        if (name) updateData.name = name;
        if (username) updateData.username = username;
        if (email) updateData.email = email;

        if (password) {
            // Hash the password before adding it to the updateData
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        // If there's nothing to update, return an error
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ msg: "No valid fields to update" }, { status: 400 });
        }

        const user = await client.user.update({
            where: { id: userId },
            data: updateData,
        });

        return NextResponse.json({ user });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ msg: "Error while updating value" }, { status: 500 });
    }
}
