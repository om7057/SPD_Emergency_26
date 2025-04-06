import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const sidebarItems = [
    { name: "Safety Stories", path: "/story-learning", icon: "📖" },
    { name: "Safety Heroes", path: "/leaderboard", icon: "🏆" },
    { name: "Safety News", path: "/latest-updates", icon: "📰" },
    { name: "Safety Games", path: "/quizzes", icon: "🧩" },
    { name: "Make Safe Choices", path: "/decision-making", icon: "🧭" },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-500 to-blue-600 text-white h-screen p-4 rounded-r-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Safety Buddies</h2>
      <div className="mb-6 flex justify-center">
        <div className="bg-yellow-400 rounded-full p-3 shadow-md transform hover:scale-105 transition-all">
          <span className="text-3xl">🛡️</span>
        </div>
      </div>
      <ul className="space-y-3">
        {sidebarItems.map((item) => (
          <li key={item.path}>
            <button
              className={`w-full text-left p-3 rounded-full flex items-center transition-all duration-200 shadow-sm transform hover:scale-105 ${
                location.pathname === item.path
                  ? "bg-white bg-opacity-20"
                  : "bg-blue-500 hover:bg-blue-400"
              }`}
              onClick={() => navigate(item.path)}
            >
              <span className="text-2xl mr-3">{item.icon}</span>
              <span className="font-medium text-base">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <span className="text-sm text-blue-100 bg-blue-600 bg-opacity-40 px-4 py-2 rounded-full">
          Stay Safe, Have Fun!
        </span>
      </div>
    </div>
  );
};

export default Sidebar;