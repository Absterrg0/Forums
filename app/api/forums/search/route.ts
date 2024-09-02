import { NextRequest, NextResponse } from 'next/server';
import client from '@/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url); // Extract searchParams from the URL
    const tag = searchParams.get('tag');

    if (typeof tag !== 'string') {
        return NextResponse.json({
            msg: 'Invalid query',
        });
    }

    try {
        const forums = await client.forums.findMany({
            where: {
                tag: {
                    contains: tag,
                    mode: 'insensitive',
                },
            },
        });
        return NextResponse.json(forums);
    } catch (e) {
        console.error(e);
        return NextResponse.json({
            msg: 'Error while searching',
        });
    }
}
