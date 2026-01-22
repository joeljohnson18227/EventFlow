import Link from "next/link";
import Button from "./Button";

export default function Navbar() {
    return (
        <nav className="border-b border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-primary-600">
                            EventFlow
                        </Link>
                    </div>
                    <div className="flex space-x-4 items-center">
                        <Link href="/events" className="text-slate-600 hover:text-slate-900">
                            Events
                        </Link>
                        <Link href="/login">
                            <Button variant="secondary">Login</Button>
                        </Link>
                        <Link href="/register">
                            <Button>Join Now</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
