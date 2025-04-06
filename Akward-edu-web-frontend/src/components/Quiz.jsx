import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const Quiz = () => {
  const { storyId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [quizList, setQuizList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [storyMeta, setStoryMeta] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);

  useEffect(() => {
    const fetchMongoUser = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/clerk/${user.id}`
        );
        const data = await res.json();
        setMongoUser(data);
      } catch (err) {
        console.error("Failed to fetch Mongo user:", err);
      }
    };
    fetchMongoUser();
  }, [user?.id]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/quiz/story/${storyId}`
        );
        const data = await response.json();
        setQuizList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };

    const fetchStoryMeta = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/stories/${storyId}`);
        const data = await res.json();
        setStoryMeta(data);
      } catch (err) {
        console.error("Error fetching story meta:", err);
      }
    };

    fetchQuiz();
    fetchStoryMeta();
  }, [storyId]);

  const handleSelect = (quizId, option) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [quizId]: option }));
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    const correctAnswers = quizList.filter(
      (quiz) => answers[quiz._id] === quiz.correctAnswer
    );
    const calculatedScore = correctAnswers.length;
    setScore(calculatedScore);

    if (!storyMeta || !mongoUser?._id) {
      console.error("Missing storyMeta or mongoUser");
      return;
    }

    // 📌 Add this inside handleSubmit (after leaderboard call)
    try {
      const progressPayload = {
        userId: mongoUser._id,
        story: storyId,
        score: calculatedScore,
        totalQuestions: quizList.length,
        topic: storyMeta.topic?._id,
        level: storyMeta.level?._id,
        answers: quizList.map((quiz) => ({
          quizId: quiz._id,
          selectedAnswer: answers[quiz._id] || null,
          isCorrect: answers[quiz._id] === quiz.correctAnswer,
        })),
      };

      const progressRes = await fetch(
        "http://localhost:5000/api/quiz-progress",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(progressPayload),
        }
      );

      if (!progressRes.ok) throw new Error("Failed to save quiz progress");

      console.log("✅ Quiz progress saved successfully!");
    } catch (err) {
      console.error("Error saving quiz progress:", err);
    }
  };

  const currentQuiz = quizList[currentIndex];
  const total = quizList.length;
  const progress = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-blue-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-purple-300">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700 flex items-center justify-center">
          <span className="text-4xl mr-2">🧠</span> Quiz Time!
        </h2>

        {total > 0 && (
          <>
            <div className="w-full bg-gray-200 rounded-full h-6 mb-8 overflow-hidden border-2 border-gray-300">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-6 rounded-full transition-all duration-500 flex items-center justify-center text-xs font-bold text-white"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>

            {!submitted && currentQuiz && (
              <>
                <div className="mb-8 p-6 border-4 rounded-xl shadow-md bg-yellow-50 border-yellow-200">
                  <p className="font-semibold mb-3 text-blue-600">
                    Question {currentIndex + 1} of {total}
                  </p>
                  <p className="text-xl font-bold mb-4 text-gray-800">
                    {currentQuiz.question}
                  </p>
                  <div className="grid gap-3">
                    {currentQuiz.options.map((option, idx) => {
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelect(currentQuiz._id, option)}
                          className={`p-4 rounded-lg text-left border-2 transition-all font-medium ${
                            answers[currentQuiz._id] === option
                              ? "bg-blue-100 border-blue-500 shadow-md"
                              : "hover:bg-blue-50 border-gray-300 hover:border-blue-300"
                          } flex items-center`}
                          disabled={submitted}
                        >
                          <span className="flex items-center justify-center w-8 h-8 rounded-full mr-3 border-2 border-gray-400 bg-white text-gray-700">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() =>
                      setCurrentIndex((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={currentIndex === 0}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-full disabled:opacity-50 font-bold text-gray-600 border-2 border-gray-300 transition-all flex items-center"
                  >
                    <span className="mr-1">◀️</span> Previous
                  </button>
                  {currentIndex === total - 1 ? (
                    <button
                      onClick={handleSubmit}
                      disabled={submitted}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full hover:from-green-600 hover:to-teal-600 disabled:opacity-50 font-bold transition-all flex items-center shadow-md"
                    >
                      Finish Quiz <span className="ml-1">✅</span>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setCurrentIndex((prev) => Math.min(prev + 1, total - 1))
                      }
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 font-bold transition-all flex items-center shadow-md"
                    >
                      Next <span className="ml-1">▶️</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {total === 0 && (
          <div className="text-center p-8 bg-yellow-50 rounded-xl border-4 border-yellow-200">
            <p className="text-xl">No quizzes available for this story yet.</p>
            <p className="mt-2 text-gray-600">Please check back later!</p>
          </div>
        )}

        {submitted && (
          <div className="text-center mt-8 bg-gradient-to-b from-yellow-50 to-orange-50 p-8 rounded-xl shadow-lg border-4 border-yellow-300">
            <div className="flex justify-center mb-4 text-6xl">
              {score / total >= 0.8 ? "🏆" : score / total >= 0.5 ? "🌟" : "👍"}
            </div>
            <h3 className="text-3xl font-bold mb-2 text-purple-700">
              You scored {score} out of {total}!
            </h3>
            <p className="text-lg mb-6 text-gray-700">
              {score / total >= 0.8
                ? "Amazing job! You're a superstar!"
                : score / total >= 0.5
                ? "Good work! Keep learning!"
                : "Nice try! Let's learn more!"}
            </p>
            <button
              onClick={() => navigate("/leaderboard")}
              className="mt-4 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 font-bold shadow-md transition-transform hover:scale-105"
            >
              🏆 See the Leaderboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
