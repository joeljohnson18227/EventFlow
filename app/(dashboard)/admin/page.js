'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Award,
  Settings,
  BarChart3,
  Shield,
  Zap,
  Bell,
  Search,
  ChevronRight,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  MoreHorizontal,
  LogOut,
  Menu,
  X,
  UserCircle
} from "lucide-react";
import Aurora from "@/components/common/Aurora";

const statsData = [
  { label: "Total Events", value: "24", change: "+3", icon: Calendar, color: "cyan" },
  { label: "Active Participants", value: "1,240", change: "+156", icon: Users, color: "violet" },
  { label: "Teams Formed", value: "342", change: "+28", icon: Activity, color: "green" },
  { label: "Certificates Issued", value: "856", change: "+89", icon: Award, color: "pink" },
];

const recentEvents = [
  { id: 1, name: "TechHacks 2026", status: "active", participants: 245, date: "Feb 10, 2026" },
  { id: 2, name: "AI Innovation Summit", status: "active", participants: 180, date: "Feb 15, 2026" },
  { id: 3, name: "CodeStorm 2026", status: "completed", participants: 320, date: "Jan 28, 2026" },
  { id: 4, name: "HackTheFuture", status: "draft", participants: 0, date: "Mar 01, 2026" },
];

const recentActivities = [
  { id: 1, action: "New user registered", user: "john@example.com", time: "2 mins ago", type: "user" },
  { id: 2, action: "Event created", user: "admin@eventflow.com", time: "15 mins ago", type: "event" },
  { id: 3, action: "Team submitted project", user: "team_alpha", time: "32 mins ago", type: "submission" },
  { id: 4, action: "Certificate generated", user: "sarah@tech.com", time: "1 hour ago", type: "certificate" },
  { id: 5, action: "Judge added to event", user: "admin@eventflow.com", time: "2 hours ago", type: "judge" },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin", active: true },
  { label: "Events", icon: Calendar, href: "/admin/events", active: false },
  { label: "Users", icon: Users, href: "/admin/users", active: false },
  { label: "Certificates", icon: Award, href: "/admin/certificates", active: false },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics", active: false },
  { label: "Settings", icon: Settings, href: "/admin/settings", active: false },
];

export default function AdminDashboard() {
  const { data: session } = useSession();
  const user = session?.user;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Event creation modal state
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    status: "upcoming",
    rules: [],
    tracks: []
  });
  const [newRule, setNewRule] = useState("");
  const [newTrack, setNewTrack] = useState("");
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [notification, setNotification] = useState(null);
  const [events, setEvents] = useState([]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    if (!eventFormData.title || !eventFormData.description || !eventFormData.startDate || !eventFormData.endDate) {
      setNotification({ type: "error", message: "Please fill in all required fields" });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    
    setIsCreatingEvent(true);
    
    // Get the current user's ID from session
    const organizerId = user?.id;
    
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...eventFormData,
          organizerId
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setNotification({ type: "success", message: "Event created successfully!" });
        setShowEventModal(false);
        setEventFormData({
          title: "",
          description: "",
          startDate: "",
          endDate: "",
          registrationDeadline: "",
          status: "upcoming",
          rules: [],
          tracks: []
        });
        fetchEvents(); // Refresh events list
      } else {
        setNotification({ type: "error", message: data.error || "Failed to create event" });
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setNotification({ type: "error", message: "Failed to create event" });
    } finally {
      setIsCreatingEvent(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      setEventFormData({ ...eventFormData, rules: [...eventFormData.rules, newRule.trim()] });
      setNewRule("");
    }
  };

  const handleRemoveRule = (index) => {
    const newRules = [...eventFormData.rules];
    newRules.splice(index, 1);
    setEventFormData({ ...eventFormData, rules: newRules });
  };

  const handleAddTrack = () => {
    if (newTrack.trim()) {
      setEventFormData({ ...eventFormData, tracks: [...eventFormData.tracks, newTrack.trim()] });
      setNewTrack("");
    }
  };

  const handleRemoveTrack = (index) => {
    const newTracks = [...eventFormData.tracks];
    newTracks.splice(index, 1);
    setEventFormData({ ...eventFormData, tracks: newTracks });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "text-neon-cyan";
      case "completed": return "text-neon-violet";
      case "draft": return "text-slate-500";
      default: return "text-slate-400";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "user": return Users;
      case "event": return Calendar;
      case "submission": return Zap;
      case "certificate": return Award;
      case "judge": return Shield;
      default: return Activity;
    }
  };

  return (
    <div className="min-h-screen bg-space-900 relative">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Aurora
          colorStops={["#00ff87", "#60a5fa", "#00ff87"]}
          amplitude={0.8}
          blend={0.5}
          speed={0.6}
        />
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-neon-cyan hover:bg-white/5 rounded-lg transition"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition group">
                <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-violet rounded-lg flex items-center justify-center shadow-lg shadow-neon-cyan/20 group-hover:shadow-neon-cyan/40 transition">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-wider">
                  EventFlow
                </span>
              </Link>
              <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-medium">
                Admin Panel
              </span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search events, users..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan/30 focus:bg-white/10 transition"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-slate-400 hover:text-neon-cyan hover:bg-white/5 rounded-lg transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-neon-cyan rounded-full"></span>
              </button>
              <div className="hidden md:flex items-center gap-3 ml-3 pl-3 border-l border-white/10">
                <Link
                  href="/profile"
                  className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-violet rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                  title="View Profile"
                >
                  <UserCircle className="w-4 h-4 text-white" />
                </Link>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">{user?.name || "Admin"}</span>
                  <span className="text-xs text-slate-500">Administrator</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition ml-2"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-slate-400 font-mono text-sm">
              Welcome back! Here&apos;s what&apos;s happening with your events.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="glass-card border-glow p-5 md:p-6 rounded-2xl transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color === 'cyan' ? 'bg-neon-cyan/10 border border-neon-cyan/20' :
                    stat.color === 'violet' ? 'bg-neon-violet/10 border border-neon-violet/20' :
                      stat.color === 'green' ? 'bg-green-500/10 border border-green-500/20' :
                        'bg-neon-pink/10 border border-neon-pink/20'
                    }`}>
                    <stat.icon className={`w-5 h-5 ${stat.color === 'cyan' ? 'text-neon-cyan' :
                      stat.color === 'violet' ? 'text-neon-violet' :
                        stat.color === 'green' ? 'text-green-400' :
                          'text-neon-pink'
                      }`} />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-green-400">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1 text-glow">
                  {stat.value}
                </div>
                <div className="text-slate-500 text-sm uppercase tracking-wider font-mono">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Recent Events - 2 columns */}
            <div className="lg:col-span-2 glass-card border-glow rounded-2xl overflow-hidden">
              <div className="p-5 md:p-6 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white tracking-wide">Recent Events</h2>
                  <p className="text-slate-500 text-sm font-mono">Manage and monitor your events</p>
                </div>
                <button 
                  onClick={() => setShowEventModal(true)}
                  className="btn-neon inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Create Event
                </button>
              </div>
              <div className="p-5 md:p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3">Event Name</th>
                        <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 hidden md:table-cell">Status</th>
                        <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 hidden lg:table-cell">Participants</th>
                        <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 hidden md:table-cell">Date</th>
                        <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {recentEvents.map((event) => (
                        <tr key={event.id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white/[0.04] rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-neon-cyan" />
                              </div>
                              <span className="text-white font-medium">{event.name}</span>
                            </div>
                          </td>
                          <td className="py-4 hidden md:table-cell">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)} bg-white/[0.04] border border-white/[0.06]`}>
                              {event.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan"></span>}
                              {event.status === 'completed' && <span className="w-1.5 h-1.5 rounded-full bg-neon-violet"></span>}
                              {event.status === 'draft' && <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>}
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 hidden lg:table-cell">
                            <span className="text-slate-400 font-mono text-sm">{event.participants}</span>
                          </td>
                          <td className="py-4 hidden md:table-cell">
                            <span className="text-slate-400 text-sm">{event.date}</span>
                          </td>
                          <td className="py-4 text-right">
                            <button className="p-2 text-slate-500 hover:text-neon-cyan hover:bg-white/5 rounded-lg transition">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex justify-center">
                  <Link href="/admin/events" className="inline-flex items-center gap-2 text-neon-cyan text-sm font-medium hover:gap-3 transition-all">
                    View All Events
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Activity Feed - 1 column */}
            <div className="glass-card border-glow rounded-2xl overflow-hidden">
              <div className="p-5 md:p-6 border-b border-white/[0.06]">
                <h2 className="text-lg font-semibold text-white tracking-wide">Recent Activity</h2>
                <p className="text-slate-500 text-sm font-mono">Latest system events</p>
              </div>
              <div className="p-5 md:p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const ActivityIcon = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-start gap-3 group">
                        <div className="w-8 h-8 bg-white/[0.04] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-neon-cyan/10 transition-colors">
                          <ActivityIcon className="w-4 h-4 text-slate-400 group-hover:text-neon-cyan transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{activity.action}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500 truncate">{activity.user}</span>
                            <span className="text-xs text-slate-600">•</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Quick Actions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
            {[
              { label: "Manage Users", icon: Users, href: "/admin/users", desc: "Add, remove, or edit user accounts" },
              { label: "Create Event", icon: Calendar, href: "/admin/events", desc: "Set up a new hackathon or event" },
              { label: "View Certificates", icon: Award, href: "/admin/certificates", desc: "Generate or verify certificates" },
              { label: "System Settings", icon: Settings, href: "/admin/settings", desc: "Configure platform preferences" },
            ].map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="glass-card border-glow p-5 rounded-2xl transition-all duration-300 group hover:bg-white/[0.04]"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 rounded-xl flex items-center justify-center mb-4 border border-neon-cyan/10 group-hover:border-neon-cyan/30 transition-colors">
                  <action.icon className="w-5 h-5 text-neon-cyan" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1 tracking-wide group-hover:text-neon-cyan transition-colors">
                  {action.label}
                </h3>
                <p className="text-slate-500 text-sm font-mono">
                  {action.desc}
                </p>
              </Link>
            ))}
          </div>

        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="absolute left-0 top-16 bottom-0 w-64 bg-space-800 border-r border-white/[0.06] p-4 overflow-y-auto">
            <nav className="space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${item.active
                    ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-space-800 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Create New Event</h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Event Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                  placeholder="Enter event title"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                  placeholder="Describe your event..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Start Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={eventFormData.startDate}
                    onChange={(e) => setEventFormData({ ...eventFormData, startDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    End Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={eventFormData.endDate}
                    onChange={(e) => setEventFormData({ ...eventFormData, endDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Registration Deadline
                </label>
                <input
                  type="date"
                  value={eventFormData.registrationDeadline}
                  onChange={(e) => setEventFormData({ ...eventFormData, registrationDeadline: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                <select
                  value={eventFormData.status}
                  onChange={(e) => setEventFormData({ ...eventFormData, status: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan/50"
                >
                  <option value="draft">Draft</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Rules */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Rules</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRule())}
                    placeholder="Add a rule"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddRule}
                    className="px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-xl hover:bg-neon-cyan/30"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {eventFormData.rules.map((rule, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 text-slate-300 rounded-lg text-sm"
                    >
                      {rule}
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(index)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tracks */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Tracks</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTrack}
                    onChange={(e) => setNewTrack(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTrack())}
                    placeholder="Add a track"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddTrack}
                    className="px-4 py-2 bg-neon-violet/20 text-neon-violet rounded-xl hover:bg-neon-violet/30"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {eventFormData.tracks.map((track, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 text-slate-300 rounded-lg text-sm"
                    >
                      {track}
                      <button
                        type="button"
                        onClick={() => handleRemoveTrack(index)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 px-4 py-3 text-slate-300 bg-white/5 rounded-xl hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingEvent}
                  className="flex-1 px-4 py-3 text-white bg-neon-cyan hover:bg-neon-cyan/80 rounded-xl transition disabled:opacity-50"
                >
                  {isCreatingEvent ? "Creating..." : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
          notification.type === "success" 
            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
            : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          {notification.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}
    </div>
  );
}
