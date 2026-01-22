export default function AdminDashboard() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-600">Manage your events, users, and system settings.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium">Total Events</h3>
                    <p className="text-2xl font-bold text-slate-900">12</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium">Active Participants</h3>
                    <p className="text-2xl font-bold text-slate-900">1,240</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium">System Health</h3>
                    <p className="text-2xl font-bold text-green-600">Stable</p>
                </div>
            </div>
        </div>
    );
}
