import { useEffect, useState } from "react";
import { getPosts } from "../api/posts";
import { PostForm } from "../components/PostForm";
import { PostList } from "../components/PostList";
import { FormAlert } from "../components/FormFeedback";

export function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getPosts()
            .then(setPosts)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    function handlePostCreated(post) {
        setPosts((prev) => [post, ...prev]);
    }

    return (
        <div className="feed">
            <PostForm onPostCreated={handlePostCreated} />
            {loading && <p>Loading posts...</p>}
            <FormAlert>{error}</FormAlert>
            {!loading && !error && <PostList posts={posts} />}
        </div>
    );
}
