import React from "react";
import { useUser } from "@clerk/clerk-react";

function Home() {
  const { user, isSignedIn } = useUser();

  console.log("🔹 Rendering Home Component...");
  console.log("🔹 User from Clerk:", user);
  console.log("🔹 User signed in:", isSignedIn);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
        Welcome to Learning App
      </h1>

      {/* User Profile Section */}
      {isSignedIn ? (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex items-center space-x-4">
            <img
              src={user?.imageUrl}
              alt={user?.fullName}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Hello, {user?.fullName}!
              </h2>
              <p className="text-gray-600">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-red-500">User not logged in.</p>
      )}
    </div>
  );
}

export default Home;
