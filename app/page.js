import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    Get started by editing&nbsp;
                    <code className="font-bold">app/page.js</code>
                </p>
            </div>

            <div className="mt-20">
                <h1 className="text-6xl font-extrabold text-primary-600 mb-4">EventFlow</h1>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl">
                    The modular hackathon infrastructure system designed for scale and flexibility.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/login"
                        className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                    >
                        Get Started
                    </Link>
                    <Link
                        href="https://github.com/your-repo/eventflow"
                        className="px-6 py-3 border border-slate-300 rounded-lg font-semibold hover:bg-slate-100 transition"
                    >
                        View on GitHub
                    </Link>
                </div>
            </div>
        </main>
    );
}
