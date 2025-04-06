import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // Adjust the path if needed

const TopicList = ({ onSelect }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("❌ Error fetching topics:", error.message);
      } else {
        setTopics(data);
      }

      setLoading(false);
    };

    fetchTopics();
  }, []);

  // Topic categories with icons (you can adjust these as needed)
  const topicIcons = {
    default: "📚", // Default icon
    safety: "🛡️",
    science: "🔬",
    math: "🔢",
    reading: "📖",
    writing: "✏️",
    health: "❤️",
    environment: "🌱",
    technology: "💻",
    art: "🎨",
    music: "🎵",
    sports: "⚽",
  };

  const getTopicIcon = (topic) => {
    // Logic to determine icon based on topic category or name
    // This is a simple example; you can expand this logic based on your data structure
    const category = topic.category?.toLowerCase() || "";
    return topicIcons[category] || topicIcons.default;
  };

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-bounce bg-blue-500 p-2 w-16 h-16 rounded-full flex justify-center items-center text-white text-xl">
        📚
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Choose Your Adventure!</h2>
      
      {topics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onSelect(topic.id)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-4 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex flex-col items-center justify-center text-center h-32"
            >
              <span className="text-3xl mb-2">{getTopicIcon(topic)}</span>
              <span className="font-medium text-base">{topic.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded-full text-center">
          <p className="flex items-center justify-center">
            <span className="text-xl mr-2">🔍</span>
            No topics available right now. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default TopicList;