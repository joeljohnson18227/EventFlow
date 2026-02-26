import Link from "next/link";
import {
    Calendar,
    Users,
    Trophy,
    GitBranch,
    Shield,
    Zap,
    CheckCircle,
    ArrowRight,
    Star,
    Code,
    Terminal,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Aurora from "@/components/common/Aurora";
const features = [
    {
        icon: Calendar,
        title: "Event Management",
        description:
            "Create and manage multiple events with configurable timelines, rules, and visibility settings in a unified command center.",
        span: "md:col-span-2 lg:col-span-2",
    },
    {
        icon: Users,
        title: "Team Formation",
        description:
            "Frictionless team creation with invite codes and intelligent size validation.",
        span: "md:col-span-1 lg:col-span-1",
    },
    {
        icon: Trophy,
        title: "Judge Evaluation",
        description:
            "Custom scoring rubrics, blind judging, and automated live ranking aggregation.",
        span: "md:col-span-1 lg:col-span-1",
    },
    {
        icon: GitBranch,
        title: "Project Submissions",
        description:
            "Phase-wise submission pipelines seamlessly linked with GitHub repositories and strict deadline enforcement.",
        span: "md:col-span-2 lg:col-span-2",
    },
    {
        icon: Shield,
        title: "Role-Based Access",
        description:
            "Highly secure, isolated environments for Admins, Participants, Mentors, and Judges with strict permission boundaries.",
        span: "md:col-span-2 lg:col-span-2",
    },
    {
        icon: Zap,
        title: "Modular Engine",
        description:
            "Toggle only the features you need. A lightweight architecture that scales with your event.",
        span: "md:col-span-1 lg:col-span-1",
    },
];

const benefits = [
    "Replace scattered Google Forms, Sheets, and emails",
    "Fair and transparent judging system",
    "Auto-generated certificates and badges",
    "Reusable infrastructure for any event",
    "Open source and community-driven",
    "Easy onboarding for contributors",
];

export default function Home() {
    return (
        <main className="min-h-screen bg-space-900 relative selection:bg-neon-cyan/30 selection:text-white">
            {/* Navigation */}
            <Navbar />

            {/* Aurora Background  */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Aurora
                    colorStops={["#00ff87", "#60a5fa", "#00ff87"]}
                    amplitude={1.2}
                    blend={0.6}
                    speed={0.8}
                />
            </div>
            <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,15,28,0.8)_100%)]" />

            {/* Hero Section */}
            <section className="relative z-10 pt-40 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neon-cyan/5 border border-neon-cyan/30 rounded-full text-neon-cyan text-xs font-mono uppercase tracking-widest mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(0,255,135,0.15)]">
                        <Star className="w-3.5 h-3.5" />
                        Open Source Event Infrastructure
                    </div>
                    
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white mb-8 tracking-tighter leading-[1.05]">
                        Run Hackathons <span className="text-slate-500 font-light">&</span><br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-cyan to-white/80 animate-pulse-glow">
                            Tech Events
                        </span>
                        <br />Seamlessly.
                    </h1>
                    
                    <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                        EventFlow is a modular, open-source platform that
                        provides the complete digital infrastructure to run
                        hackathons, OSS programs, and community tech events —
                        all in one place.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
                        <Link
                            href="/register"
                            className="btn-neon group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 tracking-wide hover:shadow-[0_0_30px_rgba(0,255,135,0.3)]"
                        >
                            Start Organizing
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="https://github.com/R3ACTR/EventFlow"
                            target="_blank"
                            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white rounded-xl font-semibold text-base hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 backdrop-blur-md"
                        >
                            <Terminal className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            View on GitHub
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="glass-card max-w-4xl mx-auto rounded-2xl border-glow backdrop-blur-xl bg-space-900/40 p-1">
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                            {[
                                { value: "100%", label: "Open Source" },
                                { value: "4+", label: "User Roles" },
                                { value: "7+", label: "Modules" },
                                { value: "MIT", label: "License" },
                            ].map((stat, i) => (
                                <div key={i} className="py-6 text-center hover:bg-white/[0.02] transition-colors rounded-xl">
                                    <div className="text-3xl font-bold text-white text-glow mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-slate-400 text-xs uppercase tracking-widest font-mono">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - Bento Grid */}
            <section id="features" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 bg-black/20 border-y border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                                Everything you need.
                            </h2>
                            <p className="text-lg text-slate-400 max-w-xl font-light">
                                A comprehensive, modular suite of tools designed exclusively for developer-focused events.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`glass-card border-glow p-8 rounded-3xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,255,135,0.05)] group bg-gradient-to-br from-white/[0.03] to-transparent ${feature.span}`}
                            >
                                <div className="w-14 h-14 bg-space-900 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:border-neon-cyan/40 transition-colors shadow-inner">
                                    <feature.icon className="w-6 h-6 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,135,0.5)]" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3 tracking-wide">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-400 leading-relaxed font-light">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-300 text-xs font-mono uppercase tracking-widest mb-6 backdrop-blur-sm">
                                Why EventFlow?
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                                Built for organizers. <br/> Loved by participants.
                            </h2>
                            <p className="text-lg text-slate-400 mb-10 font-light leading-relaxed">
                                Stop juggling disconnected tools. EventFlow
                                brings everything into one extensible system —
                                engineered for performance and clarity.
                            </p>
                            <ul className="space-y-5">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-4 group">
                                        <div className="mt-1 bg-neon-cyan/10 p-1 rounded-full border border-neon-cyan/20">
                                            <CheckCircle className="w-4 h-4 text-neon-cyan flex-shrink-0 group-hover:drop-shadow-[0_0_8px_rgba(0,255,135,0.8)] transition-all" />
                                        </div>
                                        <span className="text-slate-300 text-lg font-light">
                                            {benefit}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Staggered Dashboard Cards */}
                        <div className="relative h-full flex flex-col justify-center">
                            <div className="absolute inset-0 bg-neon-cyan/5 blur-[100px] rounded-full pointer-events-none" />
                            <div className="space-y-4 relative z-10 pl-0 md:pl-10">
                                {[
                                    { title: "Admin Center", desc: "Manage configurations & user states", icon: Shield },
                                    { title: "Hacker Dashboard", desc: "Track repos, teams & submissions", icon: GitBranch },
                                    { title: "Judging Portal", desc: "Evaluate with matrix rubrics", icon: Trophy },
                                ].map((item, i) => (
                                    <div 
                                        key={i} 
                                        className="glass-card border-glow bg-space-900/80 rounded-2xl p-5 flex items-center gap-5 transform transition-transform duration-500 hover:scale-[1.02] hover:bg-space-900"
                                        style={{ transform: `translateX(${i * 15}px)` }}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                            <item.icon className="w-5 h-5 text-neon-cyan" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white tracking-wide text-lg mb-0.5">
                                                {item.title}
                                            </div>
                                            <div className="text-slate-400 text-sm font-mono">
                                                {item.desc}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="glass-card rounded-[2.5rem] p-12 sm:p-20 border-glow relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-neon-cyan/10 blur-[80px] pointer-events-none rounded-full" />
                        
                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
                                Ready to power your next event?
                            </h2>
                            <p className="text-xl text-slate-400 mb-10 font-light max-w-2xl mx-auto">
                                Join the open-source community and deploy world-class infrastructure for your hackathon today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5 justify-center">
                                <Link
                                    href="/register"
                                    className="btn-neon inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold transition-all duration-300 tracking-wide text-base shadow-[0_0_20px_rgba(0,255,135,0.2)]"
                                >
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/events"
                                    className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-transparent text-white rounded-xl font-semibold hover:bg-white/5 transition-all duration-300 border border-white/20 hover:border-white/40"
                                >
                                    Browse Events
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-space-900/80 backdrop-blur-lg">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/30 rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(0,255,135,0.1)]">
                                <Zap className="w-5 h-5 text-neon-cyan" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-widest">
                                EVENTFLOW
                            </span>
                        </div>
                        <div className="flex items-center gap-8">
                            <Link href="/events" className="text-slate-400 hover:text-neon-cyan transition text-sm font-mono uppercase tracking-widest">
                                Events
                            </Link>
                            <Link href="https://github.com/R3ACTR/EventFlow" target="_blank" className="text-slate-400 hover:text-neon-cyan transition text-sm font-mono uppercase tracking-widest">
                                GitHub
                            </Link>
                            <Link href="/login" className="text-slate-400 hover:text-neon-cyan transition text-sm font-mono uppercase tracking-widest">
                                Login
                            </Link>
                        </div>
                        <div className="text-slate-500 text-sm font-light">
                            Built with code & community.
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}