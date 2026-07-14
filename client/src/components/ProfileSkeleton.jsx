export function ProfileSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="mb-5 flex items-center gap-5 border-b border-[var(--border)] pb-5">
                <div className="h-[88px] w-[88px] rounded-full bg-[var(--border)]" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-[var(--border)]" />
                    <div className="h-3 w-48 rounded bg-[var(--border)]" />
                    <div className="h-3 w-full rounded bg-[var(--border)]" />
                </div>
            </div>
        </div>
    );
}