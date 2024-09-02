import { NextRequest, NextResponse } from "next/server";
import client from '@/db';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Check if the username already exists
        const existingUser = await client.user.findUnique({
            where: {
                username: body.username
            }
        });

        if (existingUser) {
            return NextResponse.json({ msg: "Username already exists" }, { status: 400 });
        }

        // Hash the password and create the new user
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const newUser = await client.user.create({
            data: {
                name: body.name,
                username: body.username,
                email: body.email,
                password: hashedPassword,
            }
        });

        return NextResponse.json({ newUser });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ msg: "Error while creating the user" }, { status: 500 });
    }
}
