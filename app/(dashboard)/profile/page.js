'use client';

import { useState, useEffect } from "react";
import { User, Mail, Calendar, Award, Users, Clock, Edit2, Save, X, Shield } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", bio: "" });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditForm({ name: parsedUser.name || "", bio: parsedUser.bio || "" });
      fetchUserData(parsedUser.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      // Fetch user profile
      const profileRes = await fetch("/api/auth/profile", {
        headers: {
          "x-user-id": userId
        }
      });
      
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUser(profileData.user);
        setEditForm({ name: profileData.user.name || "", bio: profileData.user.bio || "" });
      }

      // Fetch user's team
      const teamRes = await fetch(`/api/teams?userId=${userId}`, {
        headers: {
          "x-user-id": userId
        }
      });
      
      if (teamRes.ok) {
        const teamData = await teamRes.json();
        if (teamData.teams && teamData.teams.length > 0) {
          setTeam(teamData.teams[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const userData = localStorage.getItem("user");
      const parsedUser = JSON.parse(userData);
      
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": parsedUser.id
        },
        body: JSON.stringify(editForm)
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsEditing(false);
        showNotification("Profile updated successfully!", "success");
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        showNotification("Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification("Failed to update profile", "error");
    }
  };

  const handleCancelEdit = () => {
    setEditForm({ name: user?.name || "", bio: user?.bio || "" });
    setIsEditing(false);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "mentor":
        return "bg-purple-100 text-purple-700";
      case "judge":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === "success" 
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {notification.type === "success" ? <Save className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="mt-2 text-slate-300">Manage your account information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="text-2xl font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-slate-900">{user?.name || "Unknown"}</h2>
                    )}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getRoleBadgeColor(user?.role)}`}>
                      <Shield className="w-3 h-3" />
                      {user?.role || "participant"}
                    </span>
                  </div>
                </div>

                {/* Info Fields */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">Email Address</p>
                      <p className="font-medium text-slate-900">{user?.email || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">Bio</p>
                      {isEditing ? (
                        <textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          className="w-full mt-1 text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tell us about yourself"
                          rows={3}
                        />
                      ) : (
                        <p className="font-medium text-slate-900">{user?.bio || "No bio added yet"}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Member Since</p>
                      <p className="font-medium text-slate-900">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        }) : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Info */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Your Team
              </h3>
              
              {team ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="font-semibold text-slate-900">{team.name}</p>
                    <p className="text-sm text-slate-500 mt-1">{team.event?.title || "No event"}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Role</span>
                    <span className="font-medium text-slate-900">
                      {team.leader?._id === user?._id ? "Leader" : "Member"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Members</span>
                    <span className="font-medium text-slate-900">
                      {(team.members?.length || 0) + 1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Invite Code</span>
                    <code className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                      {team.inviteCode}
                    </code>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No team yet</p>
                  <a href="/participant" className="text-blue-600 text-sm font-medium hover:underline">
                    Create or join a team
                  </a>
                </div>
              )}
            </div>

            {/* Activity Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                Activity
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Events Joined</span>
                  <span className="font-semibold text-slate-900">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Teams</span>
                  <span className="font-semibold text-slate-900">{team ? 1 : 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Submissions</span>
                  <span className="font-semibold text-slate-900">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Days Active
                  </span>
                  <span className="font-semibold text-slate-900">7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
