export default function ParticipantDashboard() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Participant Dashboard</h1>
                <p className="text-slate-600">Track your progress and manage your teams.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium">Current Project</h3>
                    <p className="text-xl font-bold text-slate-900 mt-2">FinTech Innovator</p>
                    <p className="text-slate-500 text-sm mt-1">Team: CodeNinjas</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium">Upcoming Milestones</h3>
                    <p className="text-xl font-bold text-slate-900 mt-2">Submission Deadline</p>
                    <p className="text-slate-500 text-sm mt-1">In 2 days: Jan 25, 2026</p>
                </div>
            </div>
        </div>
    );
}
