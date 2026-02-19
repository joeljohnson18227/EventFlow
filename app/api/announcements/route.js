import { NextResponse } from "next/server";
import connectDB from "@/lib/db-connect";
import Announcement from "@/models/Announcement";
import { auth } from "@/auth";
import { z } from "zod";

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  isActive: z.boolean().optional(),
  expiresAt: z.string().or(z.date()).optional().transform((val) => val ? new Date(val) : null),
});

/* GET — Fetch active announcements */
export async function GET() {
  try {
    await connectDB();

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
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

/* POST — Create announcement (organizers only) */
export async function POST(req) {
  try {
    await connectDB();

    const session = await auth();

    if (!session || (session.user.role !== "admin" && session.user.role !== "organizer"))
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await req.json();
    const validation = announcementSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const announcement = await Announcement.create({
      ...validation.data,
      createdBy: session.user.id,
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}


/* DELETE — deactivate announcement */
export async function DELETE(req) {
  try {
    await connectDB();

    const session = await auth();

    if (!session || (session.user.role !== "admin" && session.user.role !== "organizer"))
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { id } = await req.json();

    await Announcement.findByIdAndUpdate(id, { isActive: false });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}
