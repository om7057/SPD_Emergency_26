import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

function Home() {
  const { user, isSignedIn } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("🔹 Rendering Home Component...");
  console.log("🔹 User from Clerk:", user);
  console.log("🔹 User signed in:", isSignedIn);

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) {
        console.warn("No user found, skipping API call.");
        return;
      }

      console.log("Fetching user progress for Clerk ID:", user.id);

      try {
        const response = await fetch(`http://localhost:5000/api/users/${user.id}`);
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error("Failed to fetch user progress");
        }

        const data = await response.json();
        console.log("Fetched User Data:", data);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [user]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
        Welcome to Learning App
      </h1>

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

      {loading ? (
        <p className="text-center text-gray-600 mt-4">Loading user progress...</p>
      ) : userData ? (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Your Progress</h2>
          <p>Stars: {userData.currentStars}</p>
          <p>Completed Levels: {userData.completedLevels.length}</p>
          <p>Completed Stories: {userData.completedStories.length}</p>
        </div>
      ) : (
        <p className="text-red-500 text-center mt-4">No progress found.</p>
      )}
    </div>
  );
}

export default Home;
