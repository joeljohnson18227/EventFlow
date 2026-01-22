import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Button({ className, variant = "primary", ...props }) {
    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700",
        secondary: "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };

    return (
        <button
            className={cn(
                "px-4 py-2 rounded-lg font-medium transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
