import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const QuizLandingPage = () => {
  const [storiesWithQuiz, setStoriesWithQuiz] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
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
        console.error("Error fetching stories with quizzes:", err);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🧩 Choose a Story to Take Quiz</h2>
      {storiesWithQuiz.length === 0 ? (
        <p>No stories with quizzes found.</p>
      ) : (
        <ul className="space-y-4">
          {storiesWithQuiz.map((story) => (
            <li key={story._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{story.title}</h3>
              <Link to={`/quiz/${story._id}`}>
                <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                  Start Quiz
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuizLandingPage;
