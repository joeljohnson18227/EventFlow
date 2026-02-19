import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import Team from "@/models/Team";
import User from "@/models/User";
import Event from "@/models/Event";
import { auth } from "@/auth";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
});

const teamSchema = z.object({
  name: z.string().min(1, "Team name is required").trim(),
  eventId: z.string().min(1, "Please select an event for your team"),
  inviteCode: z.string().optional(),
  description: z.string().optional(),
  maxMembers: z.number().int().positive().optional().default(5),
});

// GET all teams
export async function GET(request) {
  try {
    await dbConnect();
    const session = await auth();
    let userId = session?.user?.id;
    
    let query = {};
    if (userId) {
      // Find teams where user is leader or member
      query = {
        $or: [
          { leader: userId },
          { members: userId }
        ]
      };
    }
    
    const teams = await Team.find(query)
      .populate('leader', 'name email role')
      .populate('members', 'name email role')
      .populate('event', 'title startDate endDate description')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ teams });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}

// CREATE a new team
export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const { isRateLimited } = limiter.check(5, ip); // 5 requests per minute per IP

  if (isRateLimited) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    await dbConnect();
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = teamSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { name, eventId, inviteCode, description, maxMembers } = validation.data;
    const leaderId = session.user.id;
    
    // Validate user exists and is a participant
    const user = await User.findById(leaderId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Only participants can create teams
    if (user.role !== 'participant') {
      return NextResponse.json(
        { error: "Only participants can create teams" },
        { status: 403 }
      );
    }
    
    // Validate event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }
    
    // Check if event registration is still open
    const now = new Date();
    if (event.registrationDeadline && now > new Date(event.registrationDeadline)) {
      return NextResponse.json(
        { error: "Event registration has ended" },
        { status: 400 }
      );
    }
    
    // Check if user already has a team for this specific event
    const existingTeamForEvent = await Team.findOne({
      event: eventId,
      $or: [
        { leader: leaderId },
        { members: leaderId }
      ]
    });
    
    if (existingTeamForEvent) {
      return NextResponse.json(
        { error: "You already have a team for this event" },
        { status: 400 }
      );
    }
    
    // Check if user is already in any team (global check)
    const existingTeam = await Team.findOne({
      $or: [
        { leader: leaderId },
        { members: leaderId }
      ]
    });
    
    if (existingTeam) {
      return NextResponse.json(
        { error: "You are already in a team. Leave your current team first." },
        { status: 400 }
      );
    }
    
    // Generate unique invite code
    let finalInviteCode = inviteCode || Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Check if invite code already exists
    const existingInviteCode = await Team.findOne({ inviteCode: finalInviteCode });
    if (existingInviteCode) {
      // Generate a new one if collision
      finalInviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    
    const team = await Team.create({
      name: name,
      description: description || "",
      event: eventId,
      leader: leaderId,
      members: [],
      inviteCode: finalInviteCode,
      maxMembers: maxMembers,
      status: "active",
      isVerified: false
    });
    
    await team.populate('leader', 'name email role');
    await team.populate('event', 'title startDate endDate description');
    
    return NextResponse.json({ 
      message: "Team created successfully!",
      team 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Team with this name already exists for this event" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
  }
}

