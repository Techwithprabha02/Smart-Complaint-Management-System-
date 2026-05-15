import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiMap, FiPlusCircle, FiList, FiHome } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-blue-50 text-[#2563EB]' : 'text-slate-600 hover:bg-slate-100'
    }`;

  const navLinks = isAuthenticated ? (
    <>
      <NavLink to="/my-complaints" className={linkClass} onClick={() => setOpen(false)}>
        <FiList /> My Complaints
      </NavLink>
      <NavLink to="/map" className={linkClass} onClick={() => setOpen(false)}>
        <FiMap /> Map View
      </NavLink>
      {!isAdmin && (
        <NavLink to="/submit" className={linkClass} onClick={() => setOpen(false)}>
          <FiPlusCircle /> Report Issue
        </NavLink>
      )}
      {isAdmin && (
        <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>
          <FiHome /> Admin Dashboard
        </NavLink>
      )}
    </>
  ) : (
  <>
      <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>
        Login
      </NavLink>
      <NavLink to="/signup" className={linkClass} onClick={() => setOpen(false)}>
        Sign Up
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-[#2563EB]">
          <span className="text-xl">🏙️</span>
          <span>FixMyCity</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">{navLinks}</div>

        {isAuthenticated && (
          <div className="hidden items-center gap-3 md:flex">
            <span className="text-sm text-slate-600">
              {user?.name}
              {isAdmin && (
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                  Admin
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        )}

        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">{navLinks}</div>
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <FiLogOut /> Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
