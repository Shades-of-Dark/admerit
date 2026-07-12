import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Avatar } from "./Avatar";

const linkClass = ({ isActive }) =>
    isActive
        ? "rounded-md px-3.5 py-2 text-sm font-medium bg-[var(--accent-bg)] text-[var(--accent)]"
        : "rounded-md px-3.5 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--social-bg)] hover:text-[var(--text-h)]";

export function NavBar() {
    const { user, logout } = useAuth();

    return (
        <header className="app-header">
            <nav className="flex gap-1">
                <NavLink to="/" end className={linkClass}>
                    Feed
                </NavLink>
                <NavLink to="/users" end className={linkClass}>
                    Users
                </NavLink>
                <NavLink to={`/users/${user.id}`} className={linkClass}>
                    My Profile
                </NavLink>
            </nav>
            <div className="flex items-center gap-2 text-sm text-[var(--text-h)]">
                <Link
                    to={`/users/${user.id}`}
                    className="flex items-center gap-2 rounded-md px-2 py-1 no-underline text-inherit hover:bg-[var(--social-bg)]"
                >
                    <Avatar username={user.username} src={user.profilePhoto} size={32} />
                    <span>{user.username}</span>
                </Link>
                <button
                    type="button"
                    onClick={logout}
                    className="transition-opacity hover:opacity-70"
                >
                    Log Out
                </button>
            </div>
        </header>
    );
}
