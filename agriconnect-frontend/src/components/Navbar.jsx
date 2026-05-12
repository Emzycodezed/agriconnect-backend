import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout, roleToRoute } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-soil">Agriconnect</Link>
        <div className="flex items-center gap-2">
          {!isAuthenticated && (
            <>
              <Link to="/register" className="px-4 py-2 rounded-lg bg-leaf text-white">Register</Link>
              <Link to="/login" className="px-4 py-2 rounded-lg border border-leaf text-leaf">Login</Link>
            </>
          )}

          {isAuthenticated && (
            <>
              <Link
                to={roleToRoute[user?.role] || '/'}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700"
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-soil text-white">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
