import { useEffect, useState } from "react";
import { getFeed } from "../api/posts";
import { PostForm } from "../components/PostForm";
import { PostList } from "../components/PostList";
import { FormAlert } from "../components/FormFeedback";
import { PostSkeleton } from "../components/PostSkeleton";
export function Feed() {
    const [posts, setPosts] = useState([]);
    const [discoveryMode, setDiscoveryMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getFeed()
            .then(({ posts, discoveryMode }) => {
                setPosts(posts);
                setDiscoveryMode(discoveryMode);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    function handlePostCreated(post) {
        setPosts((prev) => [post, ...prev]);
    }

    return (
        <div className="max-w-2xl">
            <PostForm onPostCreated={handlePostCreated} />
            {loading && <div>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
            </div>}
            <FormAlert>{error}</FormAlert>
            {!loading && !error && discoveryMode && (
                <p className="mb-4 text-sm text-[var(--text)]">
                    You're not following many people yet, so we've mixed in some recent posts to get you started.
                </p>
            )}
            {!loading && !error && <PostList posts={posts} />}
        </div>
    );
}
