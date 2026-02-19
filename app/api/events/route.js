import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import Event from "@/models/Event";
import { auth } from "@/auth";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().or(z.date()).transform((val) => new Date(val)),
  endDate: z.string().or(z.date()).transform((val) => new Date(val)),
  registrationDeadline: z.string().or(z.date()).optional().transform((val) => val ? new Date(val) : null),
  rules: z.array(z.string()).optional(),
  tracks: z.array(z.string()).optional(),
  status: z.enum(["upcoming", "ongoing", "ended"]).optional(),
});

// GET all events
export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  
  let query = {};
  if (status) {
    // Handle comma-separated statuses (e.g., "upcoming,ongoing")
    if (status.includes(',')) {
      query.status = { $in: status.split(',') };
    } else {
      query.status = status;
    }
  }
  
  const events = await Event.find(query)
    .populate('organizer', 'name email')
    .sort({ createdAt: -1 });
    
  return NextResponse.json({ events });
}

// CREATE event
export async function POST(request) {
  try {
    await dbConnect();
    
    const session = await auth();
    
    if (!session || (session.user.role !== "admin" && session.user.role !== "organizer")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const validation = eventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { 
      title, 
      description, 
      startDate, 
      endDate, 
      registrationDeadline,
      rules,
      tracks,
      status
    } = validation.data;
    
    const event = await Event.create({
      title,
      description,
      startDate,
      endDate,
      registrationDeadline,
      organizer: session.user.id,
      rules: rules || [],
      tracks: tracks || [],
      status: status || "upcoming"
    });
    
    await event.populate('organizer', 'name email');
    
    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

