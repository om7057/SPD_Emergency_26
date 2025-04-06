import React, { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) return;

      try {
        const response = await fetch(`http://localhost:5000/api/quiz-progress/user/${user.id}`);
        if (!response.ok) throw new Error("Failed to fetch user progress");

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("❌ Error fetching user progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 py-8">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center border-4 border-blue-200">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">My Profile</h1>
          <div className="h-1 w-24 bg-yellow-400 mx-auto rounded-full"></div>
        </div>

        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full p-1 transform -rotate-6"></div>
          <img
            src={user?.imageUrl || "/api/placeholder/100/100"}
            alt={user?.fullName || "Profile Picture"}
            className="w-28 h-28 mx-auto rounded-full border-2 border-white object-cover relative z-10"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-1">{user?.fullName || "Your Name"}</h2>
        <p className="text-gray-600 mb-4">{user?.primaryEmailAddress?.emailAddress || "email@example.com"}</p>

        {/* Progress Section */}
        <div className="p-4 bg-blue-50 rounded-xl mb-6">
          {loading ? (
            <p className="text-gray-500 text-sm">Loading progress...</p>
          ) : userData ? (
            <>
              <p className="text-sm text-gray-700 mb-1">🌟 Stars: {userData.currentStars}</p>
              <p className="text-sm text-gray-700 mb-1">📚 Completed Levels: {userData.completedLevels.length}</p>
              <p className="text-sm text-gray-700">📖 Completed Stories: {userData.completedStories.length}</p>
            </>
          ) : (
            <p className="text-red-500 text-sm">No progress data found.</p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <button
            onClick={() => navigate("/my-progress")}
            className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition shadow-md flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            My Learning Progress
          </button>

          <button
            onClick={handleLogout}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-medium hover:bg-gray-300 transition"
          >
            Log Out
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center text-blue-600 hover:text-blue-800 font-medium mt-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
