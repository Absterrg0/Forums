// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    // Get the token from cookies
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If no token or user is not an admin, redirect to login page
    if (!token || !token.isAdmin) {
        return NextResponse.redirect(new URL('/signin', req.url));
    }

    return NextResponse.next();
}

// Apply the middleware to the /admin page
export const config = {
    matcher: ['/admin/*'],
};
