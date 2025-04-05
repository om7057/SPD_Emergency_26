import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">My App</Link>

      <div>
        <SignedOut>
          <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded">Login</Link>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
