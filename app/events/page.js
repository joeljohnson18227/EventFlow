import Navbar from "@/components/common/Navbar";
import Link from "next/link";

export default function EventsPage() {
    const events = [
        { id: "1", title: "Global AI Hackathon", date: "Feb 15, 2026", status: "Upcoming" },
        { id: "2", title: "Web3 Builders Summit", date: "Mar 10, 2026", status: "Registration Open" },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Active Events</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-1 rounded">
                                {event.status}
                            </span>
                            <h3 className="text-xl font-bold text-slate-900 mt-4">{event.title}</h3>
                            <p className="text-slate-500 mt-2">{event.date}</p>
                            <Link href={`/events/${event.id}`} className="mt-6 block text-center bg-slate-100 py-2 rounded-lg font-medium hover:bg-slate-200 transition">
                                View Event
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
