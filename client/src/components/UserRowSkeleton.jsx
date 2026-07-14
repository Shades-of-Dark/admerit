export function UserRowSkeleton() {
    return (
        <div className="flex animate-pulse items-center gap-3 rounded-lg border border-[var(--border)] p-3.5">
            <div className="h-14 w-14 shrink-0 rounded-full bg-[var(--border)]" />
            <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3.5 w-24 rounded bg-[var(--border)]" />
                <div className="h-3 w-32 rounded bg-[var(--border)]" />
            </div>
        </div>
    );
}
