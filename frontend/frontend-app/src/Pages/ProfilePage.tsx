import { useAuth } from "../auth/AuthContext";
import ProfileForm from "../Components/Profile/ProfileForm";

function ProfilePage() {
    const { profile, loading } = useAuth();

    if (loading) {
        return <p>profiel inladen...</p>;
    }

    const hasProfile = !!profile?.interests && profile.interests.trim() !== "";

    if (!hasProfile) {
        return (
            <div className="container mt-5">
                <h2 className="mb-4">Vertel ons iets over jezelf</h2>

                <p className="mb-0">
                    Door dit formulier in te vullen geef je het AI-model gegevens
                    om aanbevelingen op te baseren. Voor betere aanbevelingen is
                    het handig steekwoorden te gebruiken in het profiel.
                </p>

                <p>
                    Als je geen gebruik wilt maken van de AI om je te helpen de
                    juiste module te kiezen hoef je dit formulier niet in te vullen
                    en kan je doorgaan naar de{" "}
                    <a href="/allmodules">modules</a>.
                </p>

                <ProfileForm />
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Profiel bewerken</h2>
            <ProfileForm />
        </div>
    );
}

export default ProfilePage;