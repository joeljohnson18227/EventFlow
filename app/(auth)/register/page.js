"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from './register.module.css';

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => router.push("/login"), 1500);
            } else {
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authBox}>
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Create an Account</h2>
                    <p className="mt-2 text-sm text-slate-300">Join EventFlow today</p>
                </div>

                <form className={styles.authForm} onSubmit={handleSubmit}>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 uppercase">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 uppercase">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 uppercase">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="text-blue-400 text-sm text-center bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                            {success}
                        </div>
                    )}

                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.authButton}
                        >
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>
                    </div>

                    <div className="mt-4 text-center text-sm text-slate-300">
                        Already have an account?{" "}
                        <a href="/login" className={styles.authLink}>
                            Sign In
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
