export default function LoginPage() {
    return (
        <div 
            className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden"
            style={{ 
                backgroundImage: 'url("/auth-bg.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
           
            
            <div className="w-full max-w-md space-y-6 rounded-xl bg-slate-800/80 p-8 backdrop-blur-sm border border-slate-700/50 relative z-10">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h2>
                    <p className="mt-2 text-sm text-slate-300">Sign in to your EventFlow account</p>
                </div>
                <form className="mt-6 space-y-5">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 uppercase">Email</label>
                            <input
                                type="email"
                                required
                                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 uppercase">Password</label>
                            <input
                                type="password"
                                required
                                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-lg bg-teal-500 py-2.5 px-4 text-sm font-semibold text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
                <div className="mt-4 text-center text-sm text-slate-400">
                    Don&apos;t have an account?{' '}
                    <a href="/register" className="text-teal-400 hover:text-teal-300 hover:underline font-semibold transition-colors">Sign Up</a>
                </div>
            </div>
        </div>
    );
}