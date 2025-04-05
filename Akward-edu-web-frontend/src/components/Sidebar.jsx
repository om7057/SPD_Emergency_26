import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-blue-600 text-white h-screen p-4 rounded-r-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Safety Buddies</h2>
      <div className="mb-6 flex justify-center">
        <div className="bg-yellow-300 rounded-full p-3 shadow-md">
          <span className="text-3xl">🛡️</span>
        </div>
      </div>
      <ul className="space-y-4">
        <li>
          <button
            className="w-full text-left p-3 bg-blue-500 hover:bg-blue-400 rounded-lg flex items-center transition-colors duration-200 shadow-sm"
            onClick={() => navigate("/story-learning")}
          >
            <span className="text-2xl mr-3">📖</span>
            <span className="font-medium">Safety Stories</span>
          </button>
        </li>
        <li>
          <button
            className="w-full text-left p-3 bg-blue-500 hover:bg-blue-400 rounded-lg flex items-center transition-colors duration-200 shadow-sm"
            onClick={() => navigate("/leaderboard")}
          >
            <span className="text-2xl mr-3">🏆</span>
            <span className="font-medium">Safety Heroes</span>
          </button>
        </li>
        <li>
          <button
            className="w-full text-left p-3 bg-blue-500 hover:bg-blue-400 rounded-lg flex items-center transition-colors duration-200 shadow-sm"
            onClick={() => navigate("/latest-updates")}
          >
            <span className="text-2xl mr-3">📰</span>
            <span className="font-medium">Safety News</span>
          </button>
        </li>
        <li>
          <button
            className="w-full text-left p-3 bg-blue-500 hover:bg-blue-400 rounded-lg flex items-center transition-colors duration-200 shadow-sm"
            onClick={() => navigate("/quizzes")}
          >
            <span className="text-2xl mr-3">🧩</span>
            <span className="font-medium">Safety Games</span>
          </button>
        </li>
        <li>
          <button
            className="w-full text-left p-3 bg-blue-500 hover:bg-blue-400 rounded-lg flex items-center transition-colors duration-200 shadow-sm"
            onClick={() => navigate("/decision-making")}
          >
            <span className="text-2xl mr-3">🧭</span>
            <span className="font-medium">Make Safe Choices</span>
          </button>
        </li>
      </ul>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <span className="text-xs text-blue-200">Stay Safe, Have Fun!</span>
      </div>
    </div>
  );
};

export default Sidebar;