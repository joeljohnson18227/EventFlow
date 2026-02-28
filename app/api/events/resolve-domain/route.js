import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import Event from "@/models/Event";
import { normalizeDomain } from "@/lib/custom-domain";

export const runtime = "nodejs";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const requestedDomain = searchParams.get("domain");

        const rawHost = requestedDomain
            || request.headers.get("x-forwarded-host")
            || request.headers.get("host")
            || "";

        const domain = normalizeDomain(rawHost);
        if (!domain) {
            return NextResponse.json({ eventId: null }, { status: 200 });
        }

        const connected = await dbConnect();
        if (!connected) {
            return NextResponse.json({ eventId: null }, { status: 200 });
        }

        const event = await Event.findOne({ customDomain: domain })
            .select("_id isPublic")
            .lean();

        if (!event || !event.isPublic) {
            return NextResponse.json({ eventId: null }, { status: 200 });
        }

        return NextResponse.json(
            { eventId: event._id.toString(), eventPath: `/events/${event._id.toString()}` },
            {
                status: 200,
                headers: {
                    "Cache-Control": "s-maxage=60, stale-while-revalidate=300"
                }
            }
        );
    } catch (error) {
        console.error("Failed to resolve custom domain:", error);
        return NextResponse.json({ eventId: null }, { status: 200 });
    }
}
