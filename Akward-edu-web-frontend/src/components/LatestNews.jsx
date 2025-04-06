import React, { useEffect, useState } from "react";

const LatestNews = () => {
  const [articles, setArticles] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [generatingStoryIndex, setGeneratingStoryIndex] = useState(null);
  const [savedStories, setSavedStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(false);
  const [activeStory, setActiveStory] = useState(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- Fetch news articles ---
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoadingNews(true);
        const response = await fetch("http://localhost:8000/api/news");
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to fetch news. Please try again later.");
      } finally {
        setLoadingNews(false);
      }
    };
    fetchNews();
  }, []);

  // --- Fetch saved stories ---
  useEffect(() => {
    const fetchSavedStories = async () => {
      try {
        setLoadingStories(true);
        const response = await fetch("http://localhost:8000/api/news-stories");
        const data = await response.json();
        setSavedStories(data);
      } catch (err) {
        console.error("Failed to fetch saved stories:", err);
      } finally {
        setLoadingStories(false);
      }
    };
    fetchSavedStories();
  }, []);

  // --- Generate and Save Story ---
  const handleGenerateStory = async (index) => {
    setGeneratingStoryIndex(index);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/generate-story?article_index=${index}`,
        { method: "POST" }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Story generation failed.");
      }

      const story = await response.json();
      console.log("Generated story:", story);

      // Fix the mapping of options to ensure 'to' is an index (or ID if that's your structure)
      const transformedScenes = (story.scenes || []).map((scene) => ({
        title: scene.text || scene.title || "",
        image: scene.imagePrompt || "Image placeholder",
        options: (scene.options || []).map((opt) => ({
          text: opt.text,
          to: opt.nextScene ?? opt.to ?? 0,
        })),
      }));

      const storyToSave = {
        title: story.title,
        description: articles[index]?.description || "",
        level: "6421a2fc5e7b4b5a8d3f9e7c",
        topic: articles[index]?.topicId,
        scenes: transformedScenes,
      };

      const saveResponse = await fetch(
        "http://localhost:8000/api/news-stories",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(storyToSave),
        }
      );

      if (!saveResponse.ok) {
        const data = await saveResponse.json();
        throw new Error(data.detail || "Failed to save story.");
      }

      const savedData = await saveResponse.json();
      setSuccess("Story generated and saved successfully!");
      setSavedStories((prev) => [...prev, savedData]);
    } catch (err) {
      console.error("Story generation error:", err);
      setError(err.message);
    } finally {
      setGeneratingStoryIndex(null);
    }
  };

  const startStory = (story) => {
    setActiveStory(story);
    setCurrentSceneIndex(0);
  };

  const goToScene = (nextIndex) => {
    if (
      activeStory &&
      nextIndex >= 0 &&
      nextIndex < activeStory.scenes.length
    ) {
      setCurrentSceneIndex(nextIndex);
    }
  };

  // Loading animations
  const renderLoading = (type) => (
    <div className="flex justify-center items-center p-8">
      <div className="animate-bounce bg-blue-500 p-2 w-16 h-16 rounded-full flex justify-center items-center text-white text-xl">
        {type === "news" ? "📰" : "📚"}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-blue-600">📰 Safety News Center</h2>
        <p className="text-purple-500">Learn about safety through fun interactive stories!</p>
      </div>

      {success && (
        <div className="bg-green-100 border-2 border-green-300 text-green-700 p-4 rounded-full mb-6 flex items-center justify-center">
          <span className="text-xl mr-2">✅</span>
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-2 border-red-300 text-red-700 p-4 rounded-full mb-6 flex items-center justify-center">
          <span className="text-xl mr-2">⚠️</span>
          {error}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-blue-600 flex items-center">
        <span className="mr-2">📰</span>Latest Safety Updates
      </h2>

      {loadingNews ? (
        renderLoading("news")
      ) : articles.length === 0 ? (
        <div className="bg-yellow-100 border-2 border-yellow-300 text-yellow-700 p-6 rounded-full text-center">
          <p className="flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">🔍</span>
            <span>No news articles found right now.</span>
            <span>Check back later for safety updates!</span>
          </p>
        </div>
      ) : (
        <div className="grid gap-6 mb-10">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-all transform hover:scale-102"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2 flex items-center">
                {article.topic === "Internet" && <span className="mr-2">💻</span>}
                {article.topic === "Outdoor" && <span className="mr-2">🌳</span>}
                {article.topic === "Health" && <span className="mr-2">❤️</span>}
                {article.topic === "School" && <span className="mr-2">🏫</span>}
                {!["Internet", "Outdoor", "Health", "School"].includes(article.topic) && <span className="mr-2">📰</span>}
                {article.title}
              </h3>
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium mb-3">
                {article.topic}
              </div>
              <p className="text-xs text-gray-500 mb-2">
                Source: {article.source}
              </p>
              <p className="text-gray-700 mb-4">{article.description}</p>
              <button
                onClick={() => handleGenerateStory(index)}
                disabled={generatingStoryIndex === index}
                className={`px-4 py-3 rounded-full text-white font-medium flex items-center justify-center transform transition-all ${
                  generatingStoryIndex === index
                    ? "bg-gray-400"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-md hover:scale-105"
                }`}
              >
                {generatingStoryIndex === index ? (
                  <>
                    <span className="animate-spin mr-2">🔄</span>
                    Creating Story...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✨</span>
                    Make This a Fun Story!
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-blue-600 flex items-center">
        <span className="mr-2">📚</span>Your Safety Story Collection
      </h2>

      {loadingStories ? (
        renderLoading("stories")
      ) : savedStories.length === 0 ? (
        <div className="bg-purple-100 border-2 border-purple-300 text-purple-700 p-6 rounded-full text-center">
          <p className="flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">📚</span>
            <span>No stories in your collection yet.</span>
            <span>Create one from a news article above!</span>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {savedStories.map((story, idx) => (
            <div
              key={story._id || idx}
              className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl shadow-md border-2 border-green-200 hover:border-green-400 transition-all transform hover:scale-105"
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">🦸</span>
                <h3 className="text-xl font-semibold text-green-700">
                  {story.title}
                </h3>
              </div>
              <p className="text-gray-700 mb-4 text-sm">{story.description}</p>
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
                  {story.scenes?.length || 0} Scenes
                </span>
              </div>
              <button
                onClick={() => startStory(story)}
                className="w-full px-4 py-3 rounded-full text-white font-medium bg-gradient-to-r from-green-500 to-blue-500 hover:shadow-md flex items-center justify-center transform hover:scale-105 transition-all"
              >
                <span className="mr-2">🚀</span>
                Start Adventure
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- Story Viewer --- */}
      {activeStory && activeStory.scenes?.[currentSceneIndex] && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full p-6 rounded-3xl shadow-xl border-4 border-blue-300 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-700 flex items-center">
                <span className="text-2xl mr-2">🦸</span>
                {activeStory.title}
              </h3>
              <button
                onClick={() => setActiveStory(null)}
                className="bg-red-100 hover:bg-red-200 text-red-700 rounded-full p-2 transition-all"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium inline-block mb-3">
                Scene {currentSceneIndex + 1} of {activeStory.scenes.length}
              </div>
              <p className="text-gray-800 mb-4 text-lg">
                {activeStory.scenes[currentSceneIndex].title}
              </p>
              
              {activeStory.scenes[currentSceneIndex].image && (
                <div className="rounded-xl overflow-hidden mb-4 border-2 border-blue-200">
                  {activeStory.scenes[currentSceneIndex].image === "Image placeholder" ? (
                    <div className="w-full h-52 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                      <span className="text-4xl">🖼️</span>
                    </div>
                  ) : (
                    <img
                      src={activeStory.scenes[currentSceneIndex].image}
                      alt="scene"
                      className="w-full h-52 object-cover"
                    />
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <p className="text-purple-700 font-medium mb-2">What would you do?</p>
              {activeStory.scenes[currentSceneIndex].options?.map(
                (option, i) => (
                  <button
                    key={i}
                    onClick={() => goToScene(option.to)}
                    className="block w-full text-left bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 px-5 py-3 rounded-xl font-medium text-blue-800 transform hover:scale-102 transition-all shadow-sm hover:shadow flex items-center"
                  >
                    <span className="mr-2">👉</span> {option.text}
                  </button>
                )
              )}
              
              {(!activeStory.scenes[currentSceneIndex].options || 
                activeStory.scenes[currentSceneIndex].options.length === 0) && (
                <button
                  onClick={() => setActiveStory(null)}
                  className="block w-full text-center bg-gradient-to-r from-green-100 to-blue-100 hover:from-green-200 hover:to-blue-200 px-5 py-3 rounded-xl font-medium text-green-800 transform hover:scale-102 transition-all shadow-sm hover:shadow"
                >
                  Story Complete! Return to Safety Center 🏆
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestNews;