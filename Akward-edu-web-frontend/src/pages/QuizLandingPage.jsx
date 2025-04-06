import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const QuizLandingPage = () => {
  const [storiesWithQuiz, setStoriesWithQuiz] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/stories");
        const allStories = await res.json();

        const filtered = [];

        for (const story of allStories) {
          const quizRes = await fetch(`http://localhost:5000/api/quiz/story/${story._id}`);
          const quizData = await quizRes.json();
          if (Array.isArray(quizData) && quizData.length > 0) {
            filtered.push(story);
          }
        }

        setStoriesWithQuiz(filtered);
      } catch (err) {
        console.error("❌ Error fetching stories with quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-600">🧩 Quiz Adventure Time!</h2>
        <p className="text-purple-500">Pick a story and test what you've learned</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-bounce bg-blue-500 p-2 w-16 h-16 rounded-full flex justify-center items-center text-white text-xl">
            🧩
          </div>
        </div>
      ) : storiesWithQuiz.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-6 rounded-full text-center">
          <p className="flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">🔍</span>
            <span>No quizzes available right now.</span>
            <span>Check back after reading more stories!</span>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {storiesWithQuiz.map((story) => (
            <div key={story._id} className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-200 hover:border-blue-400 transition-all transform hover:scale-105">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">📖</span>
                <h3 className="text-lg font-semibold text-blue-700">{story.title}</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                {story.description || "Test your knowledge about this story!"}
              </p>
              <Link 
                to={`/quiz/${story._id}`}
                className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-full font-medium shadow hover:shadow-lg transform transition-all"
              >
                <span className="mr-2">🚀</span>
                Start Quiz Adventure
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <div className="inline-block bg-purple-100 p-4 rounded-full">
          <p className="text-purple-600 flex items-center">
            <span className="text-xl mr-2">💡</span>
            Complete quizzes to earn special badges!
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizLandingPage;