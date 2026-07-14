import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserById } from "../api/users";
import { EditProfileForm } from "../components/EditProfileForm";
import { FormAlert } from "../components/FormFeedback";
import { PageSpinner } from "../components/Spinner";

export function EditProfilePage() {
    const { userId } = useParams();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        getUserById(userId)
            .then(setProfile)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [userId]);

    if (!user) return <Navigate to="/" />;
    if (Number(userId) !== user.id) return <Navigate to={`/users/${userId}`} />;
    if (loading) return <PageSpinner />;
    if (error) return <FormAlert>{error}</FormAlert>;
    if (!profile) return <p className="py-8 text-center text-[var(--text)]">Profile not found.</p>;

    return (
        <div className="max-w-2xl">
            <EditProfileForm profile={profile} />
        </div>
    );
}