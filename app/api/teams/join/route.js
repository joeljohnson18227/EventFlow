import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import Team from "@/models/Team";
import User from "@/models/User";

// JOIN a team using invite code
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { inviteCode, userId } = body;
    
    // Validate required fields
    if (!inviteCode || !inviteCode.trim()) {
      return NextResponse.json(
        { error: "Invite code is required" },
        { status: 400 }
      );
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Validate user exists and is a participant
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Only participants can join teams
    if (user.role !== 'participant') {
      return NextResponse.json(
        { error: "Only participants can join teams" },
        { status: 403 }
      );
    }
    
    // Find team by invite code
    const team = await Team.findOne({ 
      inviteCode: inviteCode.toUpperCase().trim() 
    }).populate('event', 'title registrationEndDate');
    
    if (!team) {
      return NextResponse.json(
        { error: "Invalid invite code. Please check and try again." },
        { status: 404 }
      );
    }
    
    // Check if event registration is still open
    if (team.event?.registrationDeadline) {
      const now = new Date();
      if (now > new Date(team.event.registrationDeadline)) {
        return NextResponse.json(
          { error: "Event registration has ended. You cannot join this team." },
          { status: 400 }
        );
      }
    }
    
    // Check if user is already the leader
    if (team.leader.toString() === userId) {
      return NextResponse.json(
        { error: "You are already the leader of this team" },
        { status: 400 }
      );
    }
    
    // Check if user is already a member
    if (team.members.includes(userId)) {
      return NextResponse.json(
        { error: "You are already a member of this team" },
        { status: 400 }
      );
    }
    
    // Check if team is full
    if (team.members.length >= team.maxMembers) {
      return NextResponse.json(
        { error: "This team is full. Cannot add more members." },
        { status: 400 }
      );
    }
    
    // Check if user is already in another team for the same event
    const existingTeamForEvent = await Team.findOne({
      event: team.event._id,
      $or: [
        { leader: userId },
        { members: userId }
      ]
    });
    
    if (existingTeamForEvent) {
      return NextResponse.json(
        { error: "You are already in a team for this event. Leave your current team first." },
        { status: 400 }
      );
    }
    
    // Check if user is already in any team (global check)
    const existingTeam = await Team.findOne({
      $or: [
        { leader: userId },
        { members: userId }
      ]
    });
    
    if (existingTeam) {
      return NextResponse.json(
        { error: "You are already in a team. Leave your current team first." },
        { status: 400 }
      );
    }
    
    // Add user to team
    team.members.push(userId);
    await team.save();
    
    await team.populate('leader', 'name email role');
    await team.populate('members', 'name email role');
    await team.populate('event', 'title startDate endDate description');
    
    return NextResponse.json({ 
      message: "Successfully joined the team!",
      team 
    });
  } catch (error) {
    console.error("Error joining team:", error);
    return NextResponse.json({ error: "Failed to join team" }, { status: 500 });
  }
}
