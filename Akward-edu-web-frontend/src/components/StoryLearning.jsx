import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StoryLearning = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/topics")
      .then((res) => res.json())
      .then((data) => {
        setTopics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching topics", err);
        setLoading(false);
      });
  }, []);

  const getTopicEmoji = (topicName) => {
    const name = topicName.toLowerCase();
    if (name.includes("abuse")) return "🛡️";
    if (name.includes("exploitation")) return "⚖️";
    if (name.includes("labour") || name.includes("labor")) return "🔨";
    if (name.includes("rights")) return "✋";
    if (name.includes("safety")) return "🔒";
    return "📚";
  };

  const getTopicColors = (topicName) => {
    const name = topicName?.toLowerCase() || "";
    if (name.includes("abuse")) 
      return "from-red-50 to-pink-50 border-red-200 hover:border-red-400";
    if (name.includes("exploitation")) 
      return "from-purple-50 to-indigo-50 border-purple-200 hover:border-purple-400";
    if (name.includes("labour") || name.includes("labor")) 
      return "from-orange-50 to-amber-50 border-orange-200 hover:border-orange-400";
    if (name.includes("rights")) 
      return "from-green-50 to-emerald-50 border-green-200 hover:border-green-400";
    if (name.includes("safety")) 
      return "from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-400";
    return "from-yellow-50 to-orange-50 border-yellow-200 hover:border-yellow-400";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-blue-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-purple-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">
            <span className="text-4xl mr-2"></span> Learning Topics
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose a topic to learn more about important issues through stories and quizzes
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-lg text-gray-600">Loading topics...</p>
          </div>
        ) : topics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {topics.map((topic) => (
              <div
                key={topic._id}
                className={`cursor-pointer bg-gradient-to-br ${getTopicColors(topic.name)} p-6 shadow-md rounded-xl hover:shadow-lg transition-all duration-300 border-2 transform hover:-translate-y-1`}
                onClick={() => navigate(`/levels/${topic._id}`)}
              >
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">{getTopicEmoji(topic.name)}</span>
                  <h2 className="text-2xl font-bold text-gray-800">{topic.name}</h2>
                </div>
                <p className="text-gray-700 mb-4">{topic.description}</p>
                <div className="flex justify-end">
                  <button className="text-sm text-white bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 font-medium flex items-center">
                    Explore <span className="ml-1">➡️</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No topics found</h3>
            <p className="text-gray-600">
              There are no learning topics available at the moment.
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Learning about important issues helps us create a better world together</p>
      </div>
    </div>
  );
};

export default StoryLearning;