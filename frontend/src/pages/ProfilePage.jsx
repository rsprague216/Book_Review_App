import PasswordChangeForm from "../components/auth/PasswordChangeForm";

const ProfilePage = () => {

    return (
        <div>
            <h1>Profile Page</h1>
            <div>
                <h3>Password Change</h3>
                <PasswordChangeForm />
            </div>
        </div>
    );
};

export default ProfilePage;