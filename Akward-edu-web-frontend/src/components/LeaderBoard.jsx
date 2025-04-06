import { useEffect, useState } from "react";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [scores, setScores] = useState([]);
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState("");
  const [filteredScores, setFilteredScores] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching initial leaderboard data...");
        const responses = await Promise.all([
          fetch("http://localhost:5000/api/users"),
          fetch("http://localhost:5000/api/stories"),
          fetch("http://localhost:5000/api/leaderboard"),
        ]);

        if (responses.some((res) => !res.ok)) {
          throw new Error("One or more API requests failed.");
        }

        const [usersData, storiesData, leaderboardData] = await Promise.all(
          responses.map((res) => res.json())
        );

        console.log("Users fetched:", usersData);
        console.log("Stories fetched:", storiesData);
        console.log("Leaderboard fetched:", leaderboardData);

        setUsers(usersData);
        setStories(storiesData);
        setScores(leaderboardData);
        setFilteredScores(leaderboardData);
        setErrorMessage("");
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setErrorMessage("Oops! We couldn't load the learning heroes board. Try again later!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        let url = "http://localhost:5000/api/leaderboard";
        if (selectedStory) {
          url = `http://localhost:5000/api/leaderboard/story/${selectedStory}`;
        }

        console.log(`Fetching leaderboard for story: ${selectedStory || "All"}`);

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
          console.error("Error loading leaderboard:", data.error || "Unknown error");
          setFilteredScores([]);
          setErrorMessage("No learning heroes found for this topic yet. Be the first one!");
          return;
        }

        console.log("Leaderboard updated:", data);
        setScores(data);
        setFilteredScores(data);
        setErrorMessage("");
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setFilteredScores([]);
        setErrorMessage("No learning heroes found for this topic yet. Be the first one!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedStory]);

  useEffect(() => {
    console.log("Scores state updated:", scores);
    console.log("Filtered Scores updated:", filteredScores);
  }, [scores, filteredScores]);

  const getUser = (userId) => {
    if (!userId) return null;
    if (typeof userId === "object" && userId._id) return userId;
    return users.find((u) => u._id === userId) || null;
  };

  const getEmoji = (index) => {
    const emojis = ["🥇", "🥈", "🥉"];
    return index < 3 ? emojis[index] : `${index + 1}`;
  };

  const getTrophyColor = (index) => {
    const colors = [
      "from-yellow-300 to-yellow-500",
      "from-gray-300 to-gray-500",    
      "from-amber-600 to-amber-800"    
    ];
    return index < 3 ? colors[index] : "from-blue-300 to-blue-500";
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded-full mr-3">
            <div className="bg-white p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Learning Heroes Board</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <label htmlFor="story-select" className="block mb-2 font-medium text-gray-700">Choose a Topic:</label>
            <select
              id="story-select"
              className="w-full p-3 border-2 border-blue-200 rounded-xl bg-blue-50 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition cursor-pointer"
              value={selectedStory}
              onChange={(e) => setSelectedStory(e.target.value)}
            >
              <option value="">All Topics</option>
              {stories.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-200 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">Loading heroes...</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border-2 border-blue-100">
              {errorMessage ? (
                <div className="p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-gray-600 text-lg">{errorMessage}</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredScores.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-blue-100 text-left">
                        <th className="p-3 text-blue-800 font-bold">#</th>
                        <th className="p-3 text-blue-800 font-bold">Hero</th>
                        <th className="p-3 text-blue-800 font-bold">Hero Name</th>
                        {!selectedStory && (
                          <th className="p-3 text-blue-800 font-bold">Total Points</th>
                        )}
                        {selectedStory && (
                          <>
                            <th className="p-3 text-blue-800 font-bold">Topic</th>
                            <th className="p-3 text-blue-800 font-bold">Level</th>
                            <th className="p-3 text-blue-800 font-bold">Points</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredScores.map((entry, index) => {
                        const user = getUser(entry.userId);
                        return (
                          <tr key={entry._id || entry.userId} className={`border-t ${index < 3 ? 'bg-blue-50' : ''}`}>
                            <td className="p-3 text-center">
                              <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r ${getTrophyColor(index)} text-white font-bold`}>
                                {getEmoji(index)}
                              </div>
                            </td>
                            <td className="p-3">
                              {user?.imageUrl ? (
                                <div className="relative">
                                  <div className={`absolute inset-0 bg-gradient-to-r ${getTrophyColor(index)} rounded-full transform -rotate-6 ${index < 3 ? 'scale-110' : 'scale-105'}`}></div>
                                  <img
                                    src={user.imageUrl}
                                    alt={user.username}
                                    className="w-12 h-12 rounded-full border-2 border-white relative z-10"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500 text-xl">?</span>
                                </div>
                              )}
                            </td>
                            <td className="p-3 font-medium">{user?.username || "Mystery Hero"}</td>

                            {!selectedStory && (
                              <td className="p-3">
                                <div className="font-bold text-xl text-blue-600">
                                  {entry.totalScore || entry.score || 0}
                                  <span className="text-sm font-normal text-blue-400 ml-1">pts</span>
                                </div>
                              </td>
                            )}

                            {selectedStory && (
                              <>
                                <td className="p-3">{entry.topic?.name || "General"}</td>
                                <td className="p-3">{entry.level?.levelNumber ? `Level ${entry.level.levelNumber}` : "All Levels"}</td>
                                <td className="p-3">
                                  <div className="font-bold text-xl text-blue-600">
                                    {entry.totalScore || entry.score || 0}
                                    <span className="text-sm font-normal text-blue-400 ml-1">pts</span>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-gray-600 text-lg">No heroes have completed this topic yet.</p>
                  <p className="text-gray-500 mt-2">Be the first to learn and earn points!</p>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-6 bg-blue-50 p-4 rounded-xl">
            <h3 className="font-bold text-blue-800 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How to Become a Learning Hero
            </h3>
            <p className="text-sm text-gray-600">
              Complete lessons and quizzes to earn points! The more you learn about important topics, the higher your score will be on the Heroes Board.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;