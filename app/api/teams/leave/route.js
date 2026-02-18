import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import Team from "@/models/Team";

// LEAVE a team
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, teamId } = body;
    
    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }
    
    // Find the team
    const team = await Team.findById(teamId);
    
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }
    
    // Check if user is the leader
    if (team.leader.toString() === userId) {
      // If leader is leaving, they can either disband the team or transfer leadership
      // For now, we'll prevent leaders from leaving without transferring
      return NextResponse.json(
        { error: "Team leader cannot leave. Transfer leadership to another member first or disband the team." },
        { status: 400 }
      );
    }
    
    // Check if user is a member
    const memberIndex = team.members.findIndex(m => m.toString() === userId);
    
    if (memberIndex === -1) {
      return NextResponse.json(
        { error: "You are not a member of this team" },
        { status: 400 }
      );
    }
    
    // Remove user from team
    team.members.splice(memberIndex, 1);
    await team.save();
    
    return NextResponse.json({ 
      message: "Successfully left the team",
      team 
    });
  } catch (error) {
    console.error("Error leaving team:", error);
    return NextResponse.json({ error: "Failed to leave team" }, { status: 500 });
  }
}

// DELETE - Disband a team (only by leader)
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const userId = searchParams.get('userId');
    
    if (!teamId || !userId) {
      return NextResponse.json(
        { error: "Team ID and User ID are required" },
        { status: 400 }
      );
    }
    
    // Find the team
    const team = await Team.findById(teamId);
    
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }
    
    // Check if user is the leader
    if (team.leader.toString() !== userId) {
      return NextResponse.json(
        { error: "Only team leader can disband the team" },
        { status: 403 }
      );
    }
    
    // Delete the team
    await Team.findByIdAndDelete(teamId);
    
    return NextResponse.json({ 
      message: "Team disbanded successfully" 
    });
  } catch (error) {
    console.error("Error disbanding team:", error);
    return NextResponse.json({ error: "Failed to disband team" }, { status: 500 });
  }
}
