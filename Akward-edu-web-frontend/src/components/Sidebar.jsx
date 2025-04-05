import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4">
      <h2 className="text-lg font-bold mb-6">Learning App</h2>
      <ul className="space-y-4">
        <li>
          <button
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
            onClick={() => navigate("/story-learning")}
          >
            📖 Learning
          </button>
        </li>
        <li>
          <button
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
            onClick={() => navigate("/leaderboard")}
          >
            🏆 Leaderboard
          </button>
        </li>
        <li>
          <button
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
            onClick={() => navigate("/latest-updates")}
          >
            📰 Latest News
          </button>
        </li>
        <li>
          <button
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
            onClick={() => navigate("/decision-making")}
          >
            🧭 Decision-Making Pathway
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
