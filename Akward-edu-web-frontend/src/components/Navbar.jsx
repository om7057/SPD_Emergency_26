import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Navigation links with child-friendly icons
  const navLinks = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Topics", path: "/topics", icon: "📚" },
    { name: "Achievements", path: "/achievements", icon: "🏆" },
    { name: "Help", path: "/help", icon: "❓" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and App name */}
          <Link to="/" className="flex items-center space-x-2 transform hover:scale-105 transition-all">
            <span className="text-2xl">🌟</span>
            <span className="text-xl font-bold text-white">Kids Learning Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-base font-medium transition-all transform hover:scale-105 ${
                  location.pathname === link.path
                    ? "bg-white bg-opacity-20 text-white"
                    : "text-white hover:bg-white hover:bg-opacity-10"
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth buttons / User profile */}
          <div className="flex items-center space-x-3">
            <SignedOut>
              <Link 
                to="/login" 
                className="bg-white text-purple-600 px-4 py-2 rounded-full font-medium shadow hover:bg-purple-50 transition-all transform hover:scale-105"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="hidden md:inline-block bg-yellow-400 text-purple-600 px-4 py-2 rounded-full font-medium shadow hover:bg-yellow-300 transition-all transform hover:scale-105"
              >
                Join Us!
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center space-x-3">
                <span className="hidden md:inline-block text-white text-base font-medium">My Account</span>
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "border-2 border-white rounded-full",
                    }
                  }}
                />
              </div>
            </SignedIn>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white focus:outline-none bg-purple-600 bg-opacity-30 p-2 rounded-full transform hover:scale-105 transition-all"
            >
              {isMenuOpen ? (
                <span className="text-xl">✖️</span>
              ) : (
                <span className="text-xl">☰</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 pb-4 border-t border-white border-opacity-20">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-full text-base font-medium transition-all ${
                    location.pathname === link.path
                      ? "bg-white bg-opacity-20 text-white"
                      : "text-white hover:bg-white hover:bg-opacity-10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2 text-lg">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
              <SignedOut>
                <Link 
                  to="/signup" 
                  className="mt-3 block md:hidden text-center bg-yellow-400 text-purple-600 px-4 py-3 rounded-full font-medium shadow transform hover:scale-105 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join Us!
                </Link>
              </SignedOut>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;