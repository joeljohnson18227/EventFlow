import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
// import Event from "@/models/Event";

export async function GET() {
    await dbConnect();
    // Fetch events logic
    return NextResponse.json({ events: [] });
}

export async function POST(request) {
    await dbConnect();
    try {
        const data = await request.json();
        // Create event logic
        return NextResponse.json({ message: "Event created", data }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create event" }, { status: 400 });
    }
}
