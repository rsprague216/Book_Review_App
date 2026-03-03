import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";

const LoginPage = () => {
    return (
        /* Full-page centered layout — sits below the fixed Header */
        <div className="flex items-center justify-center px-4 py-16 min-h-[calc(100vh-72px)]">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">

                {/* Card header */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                    <p className="text-sm text-gray-500 mt-1">Sign in to your BookBuddy account</p>
                </div>

                <LoginForm />

                {/* Footer link to registration */}
                <p className="text-sm text-center text-gray-500 mt-6">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary font-medium hover:text-primary-dark transition-colors">
                        Sign up
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default LoginPage;
