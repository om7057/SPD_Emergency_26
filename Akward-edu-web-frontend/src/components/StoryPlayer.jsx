import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useEmotionDetection from "../components/useEmotionDetection";
import EmotionChart from "./EmotionChart";

const StoryPlayer = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [storyCompleted, setStoryCompleted] = useState(false);
  const [sceneTransition, setSceneTransition] = useState(false);

  const {
    videoRef,
    emotionTimeline,
    startDetection,
    stopDetection,
  } = useEmotionDetection();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/stories/${storyId}`);
        if (!res.ok) throw new Error("Failed to fetch story");
        const data = await res.json();
        setStory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId]);

  useEffect(() => {
    let localStream;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        localStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        startDetection(); 
      })
      .catch((err) => {
        console.error("🚫 Error accessing webcam:", err);
      });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      stopDetection();
    };
  }, [videoRef, startDetection, stopDetection]);

  const handleOptionClick = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= story.scenes.length) {
      alert("That path doesn't exist. Ending story.");
      setStoryCompleted(true);
      stopDetection();
      return;
    }
    
    setSceneTransition(true);
    setTimeout(() => {
      setCurrentSceneIndex(nextIndex);
      setSceneTransition(false);
    }, 500);
  };

  const handleShowAnalysis = () => {
    stopDetection();
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setStoryCompleted(true);
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto p-6 bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-4 border-purple-300">
        <div className="inline-block animate-bounce text-5xl mb-4">📚</div>
        <p className="text-xl text-gray-700">Loading your story adventure...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-4xl mx-auto p-6 bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-4 border-red-300">
        <div className="text-5xl mb-4">❌</div>
        <p className="text-xl text-red-600">Oops! Something went wrong</p>
        <p className="text-gray-700 mt-2">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 font-medium"
        >
          Go Back
        </button>
      </div>
    </div>
  );
  
  if (!story) return (
    <div className="max-w-4xl mx-auto p-6 bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-4 border-yellow-300">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-xl text-gray-700">Story not found</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 font-medium"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  const currentScene = story.scenes[currentSceneIndex];

  const getSceneBackground = () => {
    const title = currentScene.title.toLowerCase();
    if (title.includes("sad") || title.includes("danger") || title.includes("scary")) 
      return "bg-red-50";
    if (title.includes("happy") || title.includes("safe") || title.includes("friend")) 
      return "bg-green-50";
    if (title.includes("learn") || title.includes("school")) 
      return "bg-blue-50";
    return "bg-yellow-50";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-blue-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-purple-300 relative">
        
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">{story.title}</h1>
          <p className="text-gray-600">{story.description}</p>
        </div>

        <div className="absolute top-6 right-6 w-48 h-36 rounded-lg overflow-hidden border-4 border-blue-300 shadow-md">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs py-1 text-center">
            Emotion Detector
          </div>
        </div>

        <div className={`${getSceneBackground()} border-2 border-gray-200 rounded-xl p-6 mt-4 ${sceneTransition ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
          <h2 className="text-2xl font-semibold mb-4 text-blue-800 flex items-center">
            <span className="mr-2">🎬</span> {currentScene.title}
          </h2>

          {currentScene.image && (
            <div className="mb-6">
              <img
                src={currentScene.image}
                alt={currentScene.title}
                className="w-full h-72 object-cover rounded-lg shadow-md border-2 border-gray-300"
              />
            </div>
          )}

          <div className="space-y-3 mt-6">
            {currentScene.options.map((option, index) => (
              <button
                key={index}
                className="block w-full text-left bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-5 rounded-full font-medium transition-all duration-300 hover:shadow-md hover:scale-102"
                onClick={() => handleOptionClick(option.to)}
              >
                <span className="mr-2">{index === 0 ? '🅰️' : index === 1 ? '🅱️' : '🅲️'}</span> {option.text}
              </button>
            ))}
          </div>

          {currentScene.options.length === 0 && (
            <div className="mt-8 text-center">
              <div className="inline-block text-5xl mb-4">🎉</div>
              <p className="font-bold text-green-600 text-2xl mb-4">Story Complete!</p>
              <button
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full hover:from-green-600 hover:to-teal-600 font-bold shadow-md transition-all hover:scale-105"
                onClick={handleShowAnalysis}
              >
                See My Emotion Report <span className="ml-1">👀</span>
              </button>
            </div>
          )}
        </div>

        {storyCompleted && (
          <div className="mt-8 p-6 bg-gradient-to-b from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">Your Emotion Journey</h2>
            <EmotionChart emotionTimeline={emotionTimeline} />
            
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate(`/quiz/${storyId}`)}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 font-bold shadow-md transition-all hover:scale-105"
              >
                <span className="mr-2">🧠</span> Take the Quiz
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center">
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium text-gray-700 border-2 border-gray-300 transition-all"
        >
          <span className="mr-1">◀️</span> Back to Stories
        </button>
      </div>
    </div>
  );
};

export default StoryPlayer;