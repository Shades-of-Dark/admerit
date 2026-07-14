export function PostSkeleton() {
    return (
        <div className="animate-pulse border-b border-[var(--border)] py-4">
            <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-[var(--border)]" />
                <div className="h-3 w-24 rounded bg-[var(--border)]" />
            </div>
            <div className="h-3 w-full rounded bg-[var(--border)] mb-2" />
            <div className="h-3 w-3/4 rounded bg-[var(--border)]" />
        </div>
    );
}