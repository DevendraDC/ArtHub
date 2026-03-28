export function LoadingDots() {
    return (
        <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-blue-200/80 animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                />
            ))}
        </div>
    );
}