import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Stories = () => {
  const { levelId } = useParams();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/stories")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((story) => story.level?._id === levelId);
        setStories(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stories", err);
        setLoading(false);
      });
  }, [levelId]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-blue-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-purple-300">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">
          <span className="text-4xl mr-2">📚</span> Choose Your Story
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📖</div>
            <p className="text-lg text-gray-600">Loading stories...</p>
          </div>
        ) : stories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stories.map((story) => (
              <div
                key={story._id}
                className="cursor-pointer bg-gradient-to-br from-yellow-50 to-orange-50 p-6 shadow-md rounded-xl hover:shadow-lg transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-400 transform hover:-translate-y-1"
                onClick={() => navigate(`/story-play/${story._id}`)}
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">
                    {story.topic?.name?.includes("Abuse") ? "🛡️" : 
                     story.topic?.name?.includes("Exploitation") ? "⚖️" : 
                     story.topic?.name?.includes("Labour") ? "🔨" : "📖"}
                  </span>
                  <h2 className="text-xl font-bold text-blue-700">{story.title}</h2>
                </div>
                <p className="text-gray-700 mb-4">{story.description}</p>
                <div className="flex justify-between items-center">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {story.topic?.name || "General"}
                  </span>
                  <button className="text-sm text-white bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 font-medium">
                    Read Story
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No stories found</h3>
            <p className="text-gray-600">
              There are no stories available for this level yet.
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate("/levels")}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-full font-bold text-gray-600 border-2 border-gray-300 transition-all inline-flex items-center"
          >
            <span className="mr-2">◀️</span> Back to Levels
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stories;