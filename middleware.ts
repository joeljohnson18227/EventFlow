import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { isPlatformHost, normalizeDomain } from "@/lib/custom-domain";

const authMiddleware = NextAuth(authConfig).auth;

async function resolveDomainEventPath(request: NextRequest) {
    const host = normalizeDomain(request.headers.get("x-forwarded-host") || request.headers.get("host") || "");
    if (!host || isPlatformHost(host)) return null;

    const apiUrl = new URL(`/api/events/resolve-domain?domain=${encodeURIComponent(host)}`, request.nextUrl.origin);

    try {
        const response = await fetch(apiUrl.toString(), {
            method: "GET",
            headers: {
                "x-forwarded-host": host,
            },
            cache: "no-store",
        });

        if (!response.ok) return null;
        const data = await response.json();
        return data?.eventPath || null;
    } catch (error) {
        console.error("Custom domain resolve failed:", error);
        return null;
    }
}

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === "/" || pathname === "") {
        const eventPath = await resolveDomainEventPath(request);
        if (eventPath) {
            const rewriteUrl = request.nextUrl.clone();
            rewriteUrl.pathname = eventPath;
            return NextResponse.rewrite(rewriteUrl);
        }
    }

    return authMiddleware(request as any);
}

export const config = {
    matcher: [
        "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    ],
};
