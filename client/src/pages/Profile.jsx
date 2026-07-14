import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserById, getUserPosts } from "../api/users";
import { Avatar } from "../components/Avatar";
import { FollowButton } from "../components/FollowButton";
import { PostList } from "../components/PostList";
import { FormAlert } from "../components/FormFeedback";
import { ProfileSkeleton } from "../components/ProfileSkeleton"
export function Profile() {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        Promise.all([getUserById(userId), getUserPosts(userId)])
            .then(([profileData, postsData]) => {
                setProfile(profileData);
                setPosts(postsData);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [userId]);

    if (loading) return <ProfileSkeleton></ProfileSkeleton>;
    if (error) return <FormAlert>{error}</FormAlert>;
    if (!profile) return <p className="py-8 text-center text-[var(--text)]">User not found.</p>;

    const isOwnProfile = currentUser?.id === profile.id;

    return (
        <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-5 border-b border-[var(--border)] pb-5">
                <Avatar username={profile.username} src={profile.profilePhoto} size={88} />
                <div className="min-w-0 flex-1">
                    <h2 className="mb-1">{profile.username}</h2>
                    {profile.intendedMajor && (
                        <p className="mb-1 text-[13px] text-[var(--accent)]">{profile.intendedMajor}</p>
                    )}
                    {profile.bio && <p className="mb-1.5">{profile.bio}</p>}
                    <p className="text-[13px] text-[var(--text)]">
                        {profile._count.posts} posts · {profile._count.followers} followers ·{" "}
                        {profile._count.following} following
                    </p>
                </div>
                {!isOwnProfile && (
                    <FollowButton
                        userId={profile.id}
                        isFollowing={profile.isFollowing}
                        onChange={(isFollowing) =>
                            setProfile((prev) => ({
                                ...prev,
                                isFollowing,
                                _count: {
                                    ...prev._count,
                                    followers: prev._count.followers + (isFollowing ? 1 : -1),
                                },
                            }))
                        }
                    />
                )}
                {isOwnProfile && (
                    <div className="flex flex-col items-end gap-1.5">
                        <span className="whitespace-nowrap text-[13px] text-[var(--text)]">This is you</span>
                        <Link
                            to={`/users/${userId}/edit`}
                            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--accent)] bg-[var(--accent)] px-4 py-1.5 text-sm font-medium text-[var(--accent-contrast)] no-underline transition-opacity hover:opacity-90"
                        >
                            Edit
                        </Link>
                    </div>
                )}
            </div>

            <h3 className="mb-3">Posts</h3>
            <PostList posts={posts} />
        </div>
    );
}
