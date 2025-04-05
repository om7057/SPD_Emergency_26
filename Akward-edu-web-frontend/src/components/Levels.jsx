import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Levels = () => {
  const { topicId } = useParams();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topicName, setTopicName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/topics/${topicId}`);
        const data = await response.json();
        setTopicName(data.name || "Topic");
      } catch (err) {
        console.error("Error fetching topic details", err);
      }
    };

    const fetchLevels = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/levels/topic/${topicId}`);
        const data = await response.json();
        setLevels(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching levels", err);
        setError("Couldn't load levels. Let's try again!");
        setLoading(false);
      }
    };

    fetchTopic();
    fetchLevels();
  }, [topicId]);

  const levelColors = [
    "from-blue-400 to-blue-500",
    "from-green-400 to-green-500",
    "from-yellow-400 to-yellow-500",
    "from-purple-400 to-purple-500",
    "from-pink-400 to-pink-500",
    "from-indigo-400 to-indigo-500",
  ];

  const getLevelEmoji = (levelNum) => {
    const emojis = ["🌱", "🌿", "🌲", "🌳", "🌴", "⭐", "🏆"];
    return emojis[levelNum % emojis.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 transition"
        >
          <span className="mr-1">←</span> Back to Topics
        </button>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-indigo-800">
            Learning Journey: {topicName}
          </h1>
          <p className="text-gray-600">Choose your adventure level! Each level has new stories and activities.</p>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading fun levels for you...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 p-4 rounded-lg text-center">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {levels.length > 0 ? (
              levels.map((level, index) => (
                <div
                  key={level._id}
                  className="cursor-pointer transform transition duration-300 hover:scale-105"
                  onClick={() => navigate(`/stories/${level._id}`)}
                >
                  <div className={`bg-gradient-to-r ${levelColors[index % levelColors.length]} rounded-xl shadow-lg overflow-hidden h-full`}>
                    <div className="p-6 text-white">
                      <div className="flex justify-between items-center mb-3">
                        <h2 className="text-2xl font-bold">Level {level.levelNumber}</h2>
                        <span className="text-4xl" role="img" aria-label="level icon">
                          {getLevelEmoji(level.levelNumber - 1)}
                        </span>
                      </div>
                      
                      <p className="mb-4 opacity-90">
                        {level.description || `Learn about important topics through fun stories and activities!`}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-75">
                          {level.storyCount || "Multiple"} stories
                        </span>
                        <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                          Start
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center p-12 bg-white rounded-lg shadow">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-700">No levels found for this topic yet</h3>
                <p className="text-gray-500 mt-2">Check back soon for new content!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Levels;