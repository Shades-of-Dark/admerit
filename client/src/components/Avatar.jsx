import { Avatar as RadixAvatar } from "radix-ui";

function initials(username) {
    return (username || "?").slice(0, 2).toUpperCase();
}

export function Avatar({ username, src, size = 40 }) {
    return (
        <RadixAvatar.Root
            className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--accent-bg)"
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            <RadixAvatar.Image className="h-full w-full object-cover" src={src || undefined} alt={username} />
            <RadixAvatar.Fallback
                className="font-semibold leading-none text-[var(--accent)]"
                delayMs={src ? 400 : 0}
            >
                {initials(username)}
            </RadixAvatar.Fallback>
        </RadixAvatar.Root>
    );
}
