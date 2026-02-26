import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import User from "@/models/User";
import Team from "@/models/Team";
import { auth } from "@/lib/auth";

// GET - Fetch all users with filtering and pagination
export async function GET(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const registrationFrom = searchParams.get("registrationFrom");
    const registrationTo = searchParams.get("registrationTo");
    const event = searchParams.get("event");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const filter = {};

    if (role && role !== "all") {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (registrationFrom || registrationTo) {
      filter.createdAt = {};
      if (registrationFrom) {
        const fromDate = new Date(registrationFrom);
        if (!Number.isNaN(fromDate.getTime())) {
          filter.createdAt.$gte = fromDate;
        }
      }
      if (registrationTo) {
        const toDate = new Date(registrationTo);
        if (!Number.isNaN(toDate.getTime())) {
          toDate.setHours(23, 59, 59, 999);
          filter.createdAt.$lte = toDate;
        }
      }
      if (Object.keys(filter.createdAt).length === 0) {
        delete filter.createdAt;
      }
    }

    if (event || status) {
      const baseTeamFilter = {};
      if (event && event !== "all") {
        baseTeamFilter.event = event;
      }

      const participantUserIds = new Set();
      const collectTeamParticipants = (teamList) => {
        teamList.forEach((team) => {
          if (team?.leader) participantUserIds.add(team.leader.toString());
          (team?.members || []).forEach((memberId) => participantUserIds.add(memberId.toString()));
        });
      };

      if (status === "unregistered") {
        const teamsInScope = await Team.find(baseTeamFilter).select("leader members");
        collectTeamParticipants(teamsInScope);
        filter._id = { $nin: Array.from(participantUserIds) };
      } else {
        const teamFilter = { ...baseTeamFilter };
        if (status && status !== "all") {
          teamFilter.status = status;
        }
        const matchingTeams = await Team.find(teamFilter).select("leader members");
        collectTeamParticipants(matchingTeams);
        const ids = Array.from(participantUserIds);
        if (ids.length === 0) {
          return NextResponse.json({
            users: [],
            pagination: {
              page,
              limit,
              total: 0,
              totalPages: 0,
            },
            roleDistribution: {},
          });
        }
        filter._id = { $in: ids };
      }
    }

    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter)
    ]);

    const userIds = users.map((u) => u._id);
    const teamScopeFilter = {
      $or: [
        { leader: { $in: userIds } },
        { members: { $in: userIds } },
      ],
    };
    if (event && event !== "all") {
      teamScopeFilter.event = event;
    }

    const teams = userIds.length
      ? await Team.find(teamScopeFilter)
          .select("event status leader members createdAt")
          .populate("event", "title")
          .sort({ createdAt: -1 })
      : [];

    const userTeamMap = new Map();
    teams.forEach((team) => {
      const usersInTeam = [team.leader, ...(team.members || [])]
        .filter(Boolean)
        .map((id) => id.toString());

      usersInTeam.forEach((userId) => {
        if (!userTeamMap.has(userId)) {
          userTeamMap.set(userId, {
            eventId: team.event?._id?.toString() || null,
            eventTitle: team.event?.title || null,
            status: team.status || "active",
          });
        }
      });
    });

    const usersWithParticipation = users.map((dbUser) => {
      const userObject = dbUser.toObject();
      const participation = userTeamMap.get(dbUser._id.toString()) || {
        eventId: null,
        eventTitle: null,
        status: "unregistered",
      };

      return {
        ...userObject,
        participation,
      };
    });

    // Get role distribution
    const roleDistribution = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    return NextResponse.json({
      users: usersWithParticipation,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      roleDistribution: roleDistribution.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT - Update user role or status
export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    await dbConnect();
    const { userId, role, name, bio, skills, socialLinks } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Prevent admin from changing their own role
    if (userId === session.user.id) {
      return NextResponse.json({ error: "Cannot modify your own admin role" }, { status: 400 });
    }

    const updateData = {};
    if (role) updateData.role = role;
    if (name) updateData.name = name;
    if (typeof bio === "string") updateData.bio = bio;
    if (Array.isArray(skills)) updateData.skills = skills;
    if (socialLinks) updateData.socialLinks = socialLinks;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE - Delete a user
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (userId === session.user.id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
