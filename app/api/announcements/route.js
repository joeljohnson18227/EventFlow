import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import Announcement from "@/models/Announcement";
import { auth } from "@/lib/auth";
import { z } from "zod";

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  message: z.string().min(1, "Message is required"),
  roleTarget: z.enum(["all", "participants", "judges", "mentors"]).default("all"),
  expiresAt: z.string().optional().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    { message: "Invalid date format" }
  ),
});

/* GET — Fetch active announcements */
export async function GET() {
  try {
    const connected = await dbConnect();
    
    if (!connected) {
      return NextResponse.json([], { status: 200 }); // Return empty array if DB is not connected
    }

    // Fetch active announcements that haven't expired
    const announcements = await Announcement.find({
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

/* POST — Create announcement (organizers only) */
export async function POST(req) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session || (session.user.role !== "admin" && session.user.role !== "organizer")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const validation = announcementSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const announcementData = {
      ...validation.data,
    };
    
    // Convert expiresAt string to Date if provided
    if (validation.data.expiresAt) {
      announcementData.expiresAt = new Date(validation.data.expiresAt);
    }
    
    const announcement = await Announcement.create({
      ...announcementData,
      createdBy: session.user.id,
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}

/* DELETE — deactivate announcement */
export async function DELETE(req) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session || (session.user.role !== "admin" && session.user.role !== "organizer")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await Announcement.findByIdAndUpdate(id, { isActive: false });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}
