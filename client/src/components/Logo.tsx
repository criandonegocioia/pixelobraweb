
export function Logo({ className = "h-10" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <img
                src="/logo.jpg?v=3"
                alt="Pixel Obra"
                className="h-full w-auto object-contain rounded-xl"
            />
        </div>
    );
}
