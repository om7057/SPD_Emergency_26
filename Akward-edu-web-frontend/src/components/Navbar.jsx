import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌟</span>
            <span className="text-xl font-bold text-white">Kids Learning Hub</span>
          </Link>

          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? "bg-white bg-opacity-20 text-white"
                    : "text-white hover:bg-white hover:bg-opacity-10"
                }`}
              >
                <span className="mr-1">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <SignedOut>
              <Link 
                to="/login" 
                className="bg-white text-purple-600 px-4 py-2 rounded-full font-medium shadow hover:bg-purple-50 transition-all transform hover:scale-105"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="hidden md:inline-block bg-yellow-400 text-blue-800 px-4 py-2 rounded-full font-medium shadow hover:bg-yellow-300 transition-all transform hover:scale-105"
              >
                Join Us!
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center space-x-3">
                <span className="hidden md:inline-block text-white text-sm">My Account</span>
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "border-2 border-white",
                    }
                  }}
                />
              </div>
            </SignedIn>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <span className="text-2xl">✖️</span>
              ) : (
                <span className="text-2xl">☰</span>
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-3 pb-4 border-t border-white border-opacity-20">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-base font-medium ${
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
                  className="mt-3 block md:hidden text-center bg-yellow-400 text-blue-800 px-4 py-2 rounded-full font-medium"
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