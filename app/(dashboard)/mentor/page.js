export default function MentorDashboard() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Mentor Dashboard</h1>
                <p className="text-slate-600">Support your assigned teams and share your expertise.</p>
            </header>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-900 font-bold mb-4">Assigned Teams</h3>
                    <ul className="divide-y divide-slate-100">
                        <li className="py-3 flex justify-between">
                            <span>Team Apollo</span>
                            <span className="text-primary-600 cursor-pointer">View Details</span>
                        </li>
                        <li className="py-3 flex justify-between">
                            <span>HyperLoopers</span>
                            <span className="text-primary-600 cursor-pointer">View Details</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
