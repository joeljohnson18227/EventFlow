export default function JudgeDashboard() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Judge Dashboard</h1>
                <p className="text-slate-600">Review and score project submissions.</p>
            </header>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-slate-900 font-bold mb-4">Pending Evaluations</h3>
                <p className="text-slate-500 italic">No projects assigned for review yet.</p>
            </div>
        </div>
    );
}
