/**
 * Header.jsx
 *
 * Top-of-page bar rendered on every page of the application.
 *
 * Contains two sections laid out as a horizontal row:
 *   Left  — App title ("BookBuddy"), which doubles as a home link
 *   Right — Navbar (auth-aware navigation links)
 *
 * The title acts as the home link so Navbar does not need its own Home link.
 *
 * Used by: App.jsx (replaces the bare <Navbar /> in the layout root)
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';

const Header = () => {
    const { user } = useAuth();

    return (
        <header className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200 shadow-sm">
            {/* App title — left aligned, links to home */}
            <Link to={user ? '/dashboard' : '/'} className="flex items-center">
                <h1 className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors">
                    BookBuddy
                </h1>
            </Link>

            {/* Navigation links — right aligned */}
            <Navbar />
        </header>
    );
};

export default Header;
