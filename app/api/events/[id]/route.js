import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import Event from "@/models/Event";
import { auth } from "@/lib/auth";
import { isValidCustomDomain, normalizeDomain } from "@/lib/custom-domain";

async function validateAndNormalizeCustomDomain(customDomain, eventId) {
    if (customDomain === undefined) {
        return { ok: true };
    }

    if (customDomain === null || customDomain === "") {
        return { ok: true, normalizedDomain: undefined };
    }

    const normalizedDomain = normalizeDomain(customDomain);

    if (!isValidCustomDomain(normalizedDomain)) {
        return { ok: false, status: 400, message: "Custom domain must be a valid domain like event.example.com" };
    }

    const existingEvent = await Event.findOne({ customDomain: normalizedDomain }).select("_id");
    if (existingEvent && existingEvent._id.toString() !== eventId) {
        return { ok: false, status: 409, message: "Custom domain is already in use" };
    }

    return { ok: true, normalizedDomain };
}

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        // Validate ID to prevent CastError
        if (id === "0" || id.length !== 24) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const connected = await dbConnect();
        if (!connected) {
            return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
        }

        const event = await Event.findById(id).populate("organizer", "name email");

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({ event });
    } catch (error) {
        console.error("Error fetching event details:", error);
        return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session || (session.user.role !== "organizer" && session.user.role !== "admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        const currentEvent = await Event.findById(id);
        if (!currentEvent) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        // Check ownership
        if (session.user.role !== "admin" && currentEvent.organizer.toString() !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized: You can only edit your own events" }, { status: 403 });
        }

        const domainValidation = await validateAndNormalizeCustomDomain(body.customDomain, id);
        if (!domainValidation.ok) {
            return NextResponse.json({ error: domainValidation.message }, { status: domainValidation.status });
        }

        if (body.customDomain !== undefined) {
            body.customDomain = domainValidation.normalizedDomain;
        }

        const event = await Event.findByIdAndUpdate(id, { $set: body }, { new: true });

        return NextResponse.json({ event });
    } catch (error) {
        console.error("Error patching event:", error);
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session || (session.user.role !== "organizer" && session.user.role !== "admin")) {
            // In prod, check if session.user.id === event.organizer
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        const currentEvent = await Event.findById(id);
        if (!currentEvent) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        // Check ownership
        if (session.user.role !== "admin" && currentEvent.organizer.toString() !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized: You can only edit your own events" }, { status: 403 });
        }

        const domainValidation = await validateAndNormalizeCustomDomain(body.customDomain, id);
        if (!domainValidation.ok) {
            return NextResponse.json({ error: domainValidation.message }, { status: domainValidation.status });
        }

        if (body.customDomain !== undefined) {
            body.customDomain = domainValidation.normalizedDomain;
        }

        const event = await Event.findByIdAndUpdate(id, body, { new: true });

        return NextResponse.json({ event });
    } catch (error) {
        console.error("Error updating event:", error);
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session || (session.user.role !== "organizer" && session.user.role !== "admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const event = await Event.findById(id);

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        // Check ownership
        if (session.user.role !== "admin" && event.organizer.toString() !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized: You can only delete your own events" }, { status: 403 });
        }

        await Event.findByIdAndDelete(id);

        return NextResponse.json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }
}
