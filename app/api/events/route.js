import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import Event from "@/models/Event";

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
    
    const body = await request.json();
    const { 
      title, 
      description, 
      startDate, 
      endDate, 
      registrationDeadline,
      rules,
      tracks,
      status,
      organizerId
    } = body;
    
    // Validate required fields
    if (!title || !description || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Title, description, start date, and end date are required" },
        { status: 400 }
      );
    }
    
    const event = await Event.create({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
      organizer: organizerId || null,
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
