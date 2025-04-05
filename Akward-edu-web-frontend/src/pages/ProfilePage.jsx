import React from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
        <img
          src={user?.imageUrl}
          alt={user?.fullName}
          className="w-24 h-24 mx-auto rounded-full border mb-4"
        />
        <h2 className="text-xl font-semibold">{user?.fullName}</h2>
        <p className="text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>

          <button
            onClick={() => navigate("/")}
            className="text-blue-500 hover:underline text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
